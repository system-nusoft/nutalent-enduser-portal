import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ArrowSmallLeft } from "src/assets";
import NotFound from "src/components/not-found";
import { ROUTES } from "src/constants/navigation-routes";
import { getUserRole } from "src/store/selectors/entities/auth";
import privateRouteConfig from "./private-route-config";
import styles from "./styles.module.scss";

export function isArrayWithLength(arr: TArrayOfObjects) {
  return Array.isArray(arr) && arr.length;
}

const DashboardContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useSelector(getUserRole);
  const { t } = useTranslation();

  function getAllowedRoutes(routes: TObject, role: string) {
    return routes.filter(
      ({ permission }: { permission: string[]; lock: boolean }) => {
        if (!permission) return true;
        else if (!isArrayWithLength(permission)) return true;
        return permission.includes(role);
      }
    );
  }

  let allowedRoutes = [];
  allowedRoutes = getAllowedRoutes(privateRouteConfig, userRole);

  const handleNavigate = (route: ROUTES) => {
    navigate(route);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-full overflow-hidden  gap-3 w-full">
      <Routes>
        <Route path="*" element={<NotFound />} />

        {allowedRoutes.map((route: TObject) => {
          const {
            path,
            component: Component,
            children,
            title,
            permission,
            subMenu,
            button,
            description,
            ...rest
          } = route;
          return (
            <>
              <Route
                key={path}
                path={`${path}`}
                {...rest}
                element={
                  <div className="h-full w-full position-relative overflow-auto scroll-smooth">
                    <div>{Component({ ...route })}</div>
                  </div>
                }
              />
              {children ? (
                children?.map((i: TObject) => {
                  const {
                    path,
                    component: Component,
                    children,
                    title,
                    permission,
                    removeBackBtn,
                    description,
                    ...rest
                  } = i;
                  return (
                    <Route
                      key={path}
                      path={`${path}`}
                      {...rest}
                      element={
                        <div className="h-full w-full position-relative overflow-auto scroll-smooth">
                          <div>
                            {!removeBackBtn && (
                              <span
                                onClick={handleGoBack}
                                className={`flex px-6 mb-2 gap-4 cursor-pointer mt-5 items-center ${styles.back_button}`}
                              >
                                <ArrowSmallLeft />
                                {t("heading.back")}
                              </span>
                            )}
                          </div>
                          <div>{Component({ ...route })}</div>
                        </div>
                      }
                    />
                  );
                })
              ) : (
                <></>
              )}
            </>
          );
        })}
      </Routes>
    </div>
  );
};

export default DashboardContent;
