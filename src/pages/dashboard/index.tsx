import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Divider,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { LogoBlack, User, ChatbotSidebarIcon } from "src/assets";
import { ROUTES } from "src/constants/navigation-routes";
import DashboardContent from "src/routes/dashboard-routes";
import privateRouteConfig from "src/routes/private-route-config";
import { LocalStorageService } from "src/services/local-storage";
import { getUserRole } from "src/store/selectors/entities/auth";
import { getInquiresList } from "src/store/selectors/features/inquires-selector";
import { getLoginData } from "src/store/selectors/features/login-selector";
import { getUserData } from "src/store/selectors/features/user-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleGreeting } from "src/store/slices/features/app";
import { toggleClearLogin } from "src/store/slices/features/auth";
import { toggleNewMessage } from "src/store/slices/features/messages-reducer";
import { colors } from "src/utils/colors";
import { getRandomGreeting } from "src/utils/functions";
import styles from "./styles.module.scss";

const { Content, Sider } = Layout;
const { Title } = Typography;

let token: any = null;
let currentLocation: string | null = null;

const localStorageService = new LocalStorageService();

export const Dashboard: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string[]>(["0"]);
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const role = useSelector(getUserRole);
  const loggedInUser: any = useSelector(getLoginData);
  const dispatch = useDispatch();
  const user: any = useSelector(getUserData);
  const inquires = useSelector(getInquiresList);
  const items: MenuProps["items"] = privateRouteConfig
    .filter(
      ({ permission, title }) =>
        permission.includes(role) &&
        title !== "Profile Settings" &&
        title !== "Chatbot" &&
        title !== t("heading.help&feedback")
    )
    .filter(({ sidebar }) => sidebar)
    .map(({ icon, title, path, hashPath }, index) => {
      const pathname = location.pathname;
      const parts = pathname.split("/");
      const modifiedPath = parts.length > 1 ? `${parts[2]}` : "";

      return {
        key: `${index}`,
        icon: icon ? icon() : <></>,
        label: (
          <div
            className="flex items-center
      justify-between w-full  gap-2"
          >
            {title}
            {path === "/inquiries" &&
            Array.isArray(inquires) &&
            inquires?.some(({ unreadCount }) => unreadCount > 0) ? (
              <div
                style={{ height: "0.5rem", width: "0.5rem" }}
                className={" bg-red-600 rounded-full"}
              />
            ) : (
              <></>
            )}
          </div>
        ),
        onClick: (e) => {
          setSelectedPath([e.key]);
          if (hashPath) navigate(hashPath);
          else navigate(path);
        },
        className: path === "/hire-now" ? styles.animated_border : "",
        style: {
          height: "min-content",
          background:
            modifiedPath === path ||
            location.pathname.replace("/dashboard", "") === path
              ? colors.selectedGrey
              : colors.white,
          color: colors.textColor,
          fontFamily: "Inter",
          fontSize: "0.85rem",
          fontStyle: "normal",
          position: "relative",
          fontWeight:
            modifiedPath === path ||
            location.pathname.replace("/dashboard", "") === path
              ? 600
              : 400,
        },
      };
    });

  const SelectedItem = () => {
    privateRouteConfig.map((_, index: number) => {
      setSelectedPath([`${index}`]);
    });
  };

  useEffect(() => {
    SelectedItem();
  }, [location.pathname]);

  const endItemsRoutes = [
    {
      name: "Chatbot",
      icon: () => <ChatbotSidebarIcon className={`${styles.icon}`} />,
      path: ROUTES.CHATBOT, // whatever the route path is in privateRouteConfig
    },
    {
      name: t("heading.account"),
      icon: () => <User />,
      path: ROUTES.SETTINGS,
    },
    // {
    //   name: t("heading.help&feedback"),
    //   icon: () => <Info />,
    //   path: ROUTES.HELPANDFEEDBACK,
    // },
    {
      name: t("heading.logout"),
      icon: () => <LogoutOutlined className={`${styles.icon}`} />,
      path: t("heading.logout"),
    },
  ];

  const handleLogout = () => {
    Modal.confirm({
      title: t("heading.logout"),
      content: t("heading.logoutContent"),
      icon: null,
      okType: "danger",
      okButtonProps: {
        style: { backgroundColor: colors.red, color: colors.darkRed },
      },
      onOk() {
        dispatch(toggleClearLogin());
        navigate(ROUTES.LOGIN);
      },
    });
  };

  const itemsEnd: MenuProps["items"] = endItemsRoutes.map(
    ({ icon, name, path }, index) => {
      const currentPath = location.pathname;
      return {
        key: `${index}`,
        icon: <div className="ps-2">{icon()}</div>,
        label: name,
        onClick: (e) => {
          if (path === t("heading.logout")) {
            handleLogout();
          } else {
            setSelectedPath([e.key]);
            navigate(path);
          }
        },
        style: {
          background:
            currentPath === path ||
            location.pathname.replace("/dashboard", "") === path
              ? colors.selectedGrey
              : colors.white,
          color: colors.textColor,
          fontFamily: "Inter",
          fontSize: "0.85rem",
          fontStyle: "normal",
          fontWeight:
            currentPath === path ||
            location.pathname.replace("/dashboard", "") === path
              ? 600
              : 400,
        },
      };
    }
  );

  const fetchAppConfiguration = () => {
    if (user)
      dispatch(RequestAppAction.handleGetConfiguration({ id: user?.id }));
  };

  useEffect(() => {
    fetchAppConfiguration();
  }, [user]);

  useEffect(() => {
    dispatch(toggleGreeting(getRandomGreeting()));
    dispatch(RequestAppAction.handleGetUser());
  }, []);

  token = loggedInUser?.jwtToken;
  currentLocation = location.pathname;
  useEffect(() => {
    if (token) {
      const socket = io(`${process.env.REACT_APP_SOCKET_URL}events`, {
        transports: ["websocket"],
        auth: {
          token: token,
        },
        query: {
          Authorization: `Bearer ${token}`,
        },
      });

      socket.on("newMessage", (res) => {
        if (currentLocation !== "/inquiries") {
          dispatch(RequestAppAction.handleGetInquires({ query: { page: 1 } }));
        }
        dispatch(toggleNewMessage(res));
      });

      socket.on("error", (res) => {
        if (res?.statusCode === 401) {
          dispatch(toggleClearLogin());
          localStorageService.remove("user");
          navigate(ROUTES.LOGIN);
        }
      });

      return () => {
        socket.off();
      };
    }
  }, []);

  return (
    <Layout className="w-full h-full">
      {/* header */}
      <Layout>
        <Sider
          trigger={
            <Title
              level={5}
              style={{ padding: 0, margin: 0, marginLeft: "0.5rem" }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Title>
          }
          collapsible
          collapsed={collapsed}
          theme="light"
          onCollapse={(value) => setCollapsed(value)}
          width={"15.5rem"}
          className={styles.custom_sider}
        >
          <div className={`${styles.sider_content} gap-2`}>
            {collapsed ? (
              <div className="flex items-center justify-center mt-5">
                <Avatar
                  src={user?.profilePicture ? user?.profilePicture : undefined}
                  size={25}
                >
                  {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                </Avatar>
              </div>
            ) : (
              <>
                <div className="flex px-6 mt-2 gap-2">
                  <div
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    className="flex-1 cursor-pointer"
                  >
                    <LogoBlack />
                  </div>
                  <div className="flex-1 items-center content-center gap-2">
                    <div className="flex items-center content-center ">
                      <div className="flex-1"></div>
                      {/* TODO functionlity after DEMO */}
                      {/* <div className="flex-1 ">
                        <Bell />
                      </div>
                      <div className="flex-1">
                        <Search />
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="px-6 ">
                  <Avatar
                    size={25}
                    src={
                      user?.profilePicture ? user?.profilePicture : undefined
                    }
                    className="me-2"
                  >
                    {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Typography.Text className={styles.user_name_text}>
                    {(user?.firstName ?? "") + " " + (user?.lastName ?? "")}
                  </Typography.Text>
                </div>
                <Divider className="my-2" />
              </>
            )}

            <Menu
              mode="inline"
              className="h-100"
              selectable
              selectedKeys={selectedPath}
              items={items}
            />
            <Menu
              mode="inline"
              selectable
              selectedKeys={selectedPath}
              items={itemsEnd}
              className={styles.items_end}
            />
          </div>
        </Sider>
        <Layout>
          <Content className="overflow-initial scroll-smooth h-full w-full">
            <div className="overflow-auto scroll-smooth h-full w-full">
              <DashboardContent />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
