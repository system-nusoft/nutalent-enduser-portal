import { Avatar, Empty, Form, Skeleton, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input, TableSearch } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import {
  getInquiresData,
  getInquiresList,
  getInquiresMeta,
  inquiresLoading,
} from "src/store/selectors/features/inquires-selector";
import {
  getUserId,
  getUsername,
} from "src/store/selectors/features/login-selector";
import {
  getMessagesData,
  getMessagesList,
  getMessagesMeta,
  getNewMessageData,
  messagesLoading,
} from "src/store/selectors/features/messages-selector";
import RequestAppAction from "src/store/slices/app-actions";
import { toggleUpdateGetInquires } from "src/store/slices/features/inquires-selector";
import { toggleNewMessage } from "src/store/slices/features/messages-reducer";
import { colors, getRandomColor } from "src/utils/colors";
import {
  returnDateOnly,
  returnTime,
  returnYearOnly,
} from "src/utils/functions";
import styles from "./styles.module.scss";
interface props {
  title?: string;
}

let currSelected: undefined | string = undefined;

export const Inquires = ({ title }: props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageInquires, setPageInquires] = useState(1);
  const list: any = useSelector(getInquiresList);
  const meta: any = useSelector(getMessagesMeta);
  const metaInquires: any = useSelector(getInquiresMeta);
  const data: any = useSelector(getMessagesData);
  const inquiresData: any = useSelector(getInquiresData);
  const userName = useSelector(getUsername);
  const isSendingMessage = useSelector(messagesLoading);
  const userId = useSelector(getUserId);
  const isSearching = useSelector(inquiresLoading);
  const scrollRef = useRef<any>(null);
  const scrollRefInquires = useRef(null);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [inquiriesList, setinquiresList] = useState<any[]>([]);
  const messages = useSelector(getMessagesList);
  const [scrollFetch, setScrollFetch] = useState(false);
  const [scrollFetchInquires, setScrollFetchInquires] = useState(false);
  const [form] = Form.useForm();
  const newMessage: any = useSelector(getNewMessageData);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<{
    id: string;
    resourceFirstName: string;
    resourceId: string;
    resourceLastName: string;
    resourceJobTitle: string;
  } | null>(null);

  const isRecevier = (id: string) => {
    return id === userId ? false : true;
  };

  useEffect(() => {
    if (Array.isArray(list) && list?.length > 0 && isLoading) {
      const id = list[0]?.id;
      const resourceFirstName = list[0]?.resourceFirstName;
      const resourceLastName = list[0]?.resourceLastName;
      const resourceJobTitle = list[0]?.resourceJobTitle;
      const resourceId = list[0]?.resourceId;

      setinquiresList(list);
      setSelected({
        resourceFirstName,
        id,
        resourceId,
        resourceLastName,
        resourceJobTitle,
      });
      setIsLoading(false);
    }
  }, [inquiresData]);

  // const unReadFirstMessage = (data: any[]) => {
  //   const updatedItems = data?.map(
  //     (item: { unreadCount: number }, index: number) => ({
  //       ...item,
  //       unreadCount: index === 0 ? 0 : item?.unreadCount, // Set the first item's unreadCount to 0
  //     })
  //   );
  //   dispatch(toggleUpdateGetInquires({ ...inquiresData, items: updatedItems }));
  //   setinquiresList(updatedItems);
  // };

  const dispatch = useDispatch();
  const getInquires = () => {
    dispatch(
      RequestAppAction.handleGetInquires({
        query: {
          page: page,
        },
        cbSuccess: (res) => {
          setIsLoading(false);
          if (res?.items?.length > 0 && Array.isArray(res?.items)) {
            const id = res?.items[0]?.id;
            const resourceFirstName = res?.items[0]?.resourceFirstName;
            const resourceLastName = res?.items[0]?.resourceLastName;
            const resourceJobTitle = res?.items[0]?.resourceJobTitle;
            const resourceId = res?.items[0]?.resourceId;
            setinquiresList(res?.items);
            setSelected({
              resourceFirstName,
              id,
              resourceId,
              resourceLastName,
              resourceJobTitle,
            });
          }
        },
        cbFailure: () => {
          setIsLoading(false);
        },
      })
    );
  };

  const onSelectInquires = (id: string) => {
    dispatch(
      RequestAppAction.handleGetMessages({
        id: id,
        cbSuccess: (res) => {
          setPage(1);
          setMessagesList(res?.items);
        },
      })
    );
  };

  useEffect(() => {
    getInquires();
    return () => {
      dispatch(toggleNewMessage(null));
    };
  }, []);

  useEffect(() => {
    if (selected?.id) {
      onSelectInquires(selected?.id);
    }
  }, [selected]);

  const sendMessage = (message: string, resourceId: string) => {
    if (selected) {
      form.setFieldValue("message", null);
      dispatch(
        RequestAppAction.handleSendMessage({
          data: { content: message, resourceId: resourceId },
          cbSuccess: (res) => {
            setMessagesList([res, ...messagesList]);

            setTimeout(() => {
              if (scrollRef.current)
                scrollRef?.current.scrollTo({ top: 0, behavior: "smooth" });
            }, 800);
          },
          cbFailure: () => {
            form.setFieldValue("message", message);
          },
        })
      );
    }
  };

  useEffect(() => {
    if (scrollFetch && selected) {
      dispatch(
        RequestAppAction.handleGetMessages({
          id: selected?.id,
          data: {
            page: page + 1,
          },
          cbSuccess: (res) => {
            if (selected?.id) {
              updateList(selected?.id);
            }
            setMessagesList([...messagesList, ...res?.items]);
            setPage(page + 1);
            setScrollFetch(false);
          },
        })
      );
    }
  }, [scrollFetch]);

  useEffect(() => {
    if (scrollFetchInquires) {
      dispatch(
        RequestAppAction.handleGetInquires({
          query: {
            page: page + 1,
          },
          cbSuccess: (res) => {
            if (selected?.id) {
              const arr = inquiriesList?.map((i: any) => {
                if (i.id === selected?.id) {
                  return {
                    ...i,
                    unreadCount: 0,
                  };
                } else return i;
              });
              setinquiresList([...arr, ...res?.items]);
              dispatch(
                toggleUpdateGetInquires({ ...inquiresData, items: arr })
              );
            } else {
              setinquiresList([...inquiriesList, ...res?.items]);
            }
            setPageInquires(page + 1);
            setScrollFetchInquires(false);
          },
        })
      );
    }
  }, [scrollFetchInquires]);
  const onScrollInquries = () => {
    if (scrollRefInquires.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollRefInquires.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isNearBottom) {
        if (pageInquires < metaInquires?.totalPages) {
          setScrollFetchInquires(true);
        }
      }
    }
  };

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearTop = clientHeight - scrollHeight;

      if (-scrollTop + 10 > -isNearTop) {
        if (page < meta?.totalPages) {
          setScrollFetch(true);
        }
      }
    }
  };

  useEffect(() => {
    const listInnerElement: any = scrollRef?.current;

    if (listInnerElement) {
      listInnerElement.addEventListener("scroll", onScroll);

      return () => {
        listInnerElement.removeEventListener("scroll", onScroll);
      };
    }
  }, [data, page]);

  useEffect(() => {
    const listInnerElement: any = scrollRefInquires?.current;

    if (listInnerElement) {
      listInnerElement.addEventListener("scroll", onScrollInquries);

      return () => {
        listInnerElement.removeEventListener("scroll", onScrollInquries);
      };
    }
  }, [list, pageInquires]);

  currSelected = selected?.id;
  useEffect(() => {
    if (newMessage?.inquiryId) {
      const query = {
        page: 1,
      };

      // Fetch new inquiries
      dispatch(
        RequestAppAction.handleGetInquires({
          query: query,
          cbSuccess: (res) => {
            if (Array.isArray(res?.items)) {
              // Filter items in res.items that do not exist in inquiriesList
              const existingIds = inquiriesList.map((inquiry) => inquiry.id);
              const newItems =
                res?.items?.filter(
                  (item: { id: string }) => !existingIds.includes(item.id)
                ) || [];

              const itemsMap = new Map(
                res?.items?.map((item: { id: string; unreadCount: number }) => [
                  item.id,
                  item,
                ])
              );

              const updatedItems = inquiriesList.map((inquiry) => {
                const matchingItem: any = itemsMap.get(inquiry.id);
                return {
                  ...inquiry,
                  unreadCount:
                    currSelected === inquiry?.id
                      ? 0
                      : matchingItem?.unreadCount ?? inquiry.unreadCount,
                };
              });

              // Identify new items not already in inquiriesList

              // If there are new items, add them on top of the list
              if (newItems.length > 0) {
                setinquiresList([...newItems, ...updatedItems]);
                dispatch(
                  toggleUpdateGetInquires({
                    ...inquiresData,
                    items: [...newItems, ...updatedItems],
                  })
                );
              } else {
                setinquiresList([...updatedItems]);
                dispatch(
                  toggleUpdateGetInquires({
                    ...inquiresData,
                    items: [...updatedItems],
                  })
                );
              }
            }

            // Add a new message if inquiryId matches the selected id
            if (newMessage?.inquiryId === selected?.id && newMessage !== null) {
              const newObj = {
                id: newMessage?.id || Math.random(),
                inquiryId: newMessage?.inquiryId,
                content: newMessage?.message,
                senderId: newMessage?.senderId,
                readAt: newMessage?.readAt || new Date(),
                sentAt: newMessage?.sentAt || new Date(),
                repliedAt: newMessage?.repliedAt || new Date(),
                resourceId: newMessage?.resourceId,
              };
              setMessagesList([newObj, ...messagesList]);
            }
            dispatch(toggleNewMessage(null));
          },
        })
      );
    }
  }, [newMessage]);

  const navigate = useNavigate();

  const updateList = (id: string) => {
    if (Array.isArray(inquiriesList) && inquiriesList?.length > 0) {
      const arr = inquiriesList?.map((i: any) => {
        if (i.id === id) {
          return {
            ...i,
            unreadCount: 0,
          };
        } else return i;
      });
      setinquiresList(arr);
      dispatch(toggleUpdateGetInquires({ ...inquiresData, items: arr }));
    }
  };

  return (
    <Spin spinning={false}>
      <PrivatePageTemplate
        title={title}
        description={
          <span className="flex gap-2 items-center">{t("inquiries.desc")}</span>
        }
      >
        <div className="mt-5">
          <TableSearch
            loading={isSearching && !isLoading}
            onSearch={(val) => {
              setPage(1);
              dispatch(
                RequestAppAction.handleGetInquires({
                  query: {
                    page: 1,
                    search: val,
                  },
                  cbSuccess: (res) => {
                    if (res?.items?.length > 0) {
                      setinquiresList([...res?.items]);
                      setSelected({
                        resourceFirstName: res?.items[0]?.resourceFirstName,
                        resourceLastName: res?.items[0]?.resourceLastName,
                        id: res?.items[0]?.id,
                        resourceId: res?.items[0]?.resourceId,
                        resourceJobTitle: res?.items[0]?.resourceJobTitle,
                      });
                      setPageInquires(1);
                      setScrollFetchInquires(false);
                      dispatch(
                        RequestAppAction.handleGetMessages({
                          id: res?.items[0]?.id,
                          data: {
                            page: 1,
                          },
                          cbSuccess: (res) => {
                            if (res?.items?.length > 0) {
                              setMessagesList([...res?.items]);
                              setPage(1);
                              setScrollFetch(false);
                            } else {
                              setMessagesList([]);
                            }
                          },
                        })
                      );
                    } else {
                      setinquiresList([]);
                      setMessagesList([]);
                      setSelected(null);
                    }
                  },
                })
              );
            }}
          />
        </div>

        <div className="flex gap-4 h-[67vh]">
          <div
            ref={scrollRefInquires}
            className="grow-1 min-w-48 rounded-xl border bg-white p-4 overflow-auto flex gap-2 flex-col"
          >
            <Skeleton active loading={isLoading}>
              {inquiriesList?.length > 0 ? (
                inquiriesList?.map(
                  ({
                    resourceFirstName,
                    resourceLastName,
                    id,
                    resourceId,
                    unreadCount,
                    resourceJobTitle,
                  }: {
                    resourceFirstName: string;
                    resourceLastName: string;
                    id: string;
                    resourceId: string;
                    resourceJobTitle: string;
                    unreadCount: number;
                  }) => (
                    <div
                      onClick={() => {
                        setMessagesList([]);
                        updateList(id);
                        setSelected({
                          resourceFirstName,
                          id,
                          resourceId,
                          resourceLastName,
                          resourceJobTitle,
                        });
                      }}
                      key={id}
                      className={` ${
                        selected?.id === id ? `px-3 bg-slate-100` : ""
                      } flex gap-2 cursor-pointer justify-between items-center p-2  rounded-xl`}
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar
                          style={{
                            background: getRandomColor(resourceFirstName),
                            color: colors.black,
                            height: "2.2rem",
                            width: "2.2rem",
                          }}
                        >
                          {resourceFirstName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <div className="flex flex-col">
                          <p className={`${styles.chat_text_fname}`}>
                            {resourceFirstName ?? ""}
                          </p>
                          <p className={styles.chat_text}>
                            {resourceLastName ?? ""}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        {unreadCount > 0 ? (
                          <div className={styles.notification_dot} />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="h-96 justify-center items-center flex">
                  <Empty />
                </div>
              )}
            </Skeleton>
          </div>
          <div className="grow-[2] border   bg-white rounded-xl p-4 gap-2 flex flex-col h-full">
            <div className="flex relative flex-col items-center justify-center h-full">
              <div className="w-full absolute -top-2 px-4 z-10">
                {selected?.id ? (
                  <div className="bg-white border w-full flex gap-2 items-center justify-between p-2 rounded-xl">
                    <>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          style={{
                            background: getRandomColor(
                              selected?.resourceFirstName
                            ),
                            color: colors.black,
                            height: "2.2rem",
                            width: "2.2rem",
                          }}
                        >
                          {selected.resourceFirstName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex gap-1 items-center">
                            <p className={`${styles.chat_text_fname}`}>
                              {selected?.resourceFirstName ?? ""}
                            </p>
                            <p className={styles.chat_text}>
                              {selected?.resourceLastName ?? ""}
                            </p>
                          </div>
                          <p className={`${styles.chat_text}`}>
                            {selected?.resourceJobTitle ?? ""}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button
                          label={t("button.viewProfile")}
                          onClick={() => {
                            navigate(
                              ROUTES.RESOURCEBYID.replace(
                                ":id",
                                selected?.resourceId
                              )
                            );
                          }}
                          btn_class="white_btn"
                        />
                      </div>
                    </>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div
                ref={scrollRef}
                className="flex  pb-6 pt-16 flex-col-reverse flex-grow w-full min-h-0 max h-96 overflow-y-auto scroll-smooth"
              >
                <Skeleton active loading={isLoading}>
                  {messagesList?.length > 0 ? (
                    messagesList?.map(
                      ({
                        content,
                        senderId,
                        sentAt,
                      }: {
                        content: string;
                        senderId: string;
                        sentAt: string;
                        readAt: string | null;
                      }) => (
                        <div
                          className={`flex  ${
                            isRecevier(senderId)
                              ? "justify-start "
                              : "justify-end"
                          } items-center gap-2 mt-4 w-auto min-w-28 mx-4`}
                        >
                          {isRecevier(senderId) && (
                            <Avatar
                              className="flex justify-center align-middle"
                              style={{
                                background: getRandomColor(
                                  selected?.resourceFirstName ?? "A"
                                ),
                                color: colors.black,
                                height: "2.2rem",
                                width: "2.2rem",
                              }}
                            >
                              {selected?.resourceFirstName
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </Avatar>
                          )}
                          <div
                            className={`${
                              isRecevier(senderId)
                                ? ` ${styles.message_div}`
                                : ` ${styles.message_sent_div} `
                            } flex flex-col gap-1 p-2 rounded-xl`}
                          >
                            {isRecevier(senderId) && (
                              <span
                                className={`text-start ${styles.user_name}`}
                              >
                                {t("heading.manager", {
                                  name:
                                    selected?.resourceFirstName &&
                                    selected?.resourceFirstName?.length > 0
                                      ? selected?.resourceFirstName?.split(
                                          " "
                                        )[0]
                                      : "",
                                })}
                                {}
                              </span>
                            )}
                            <span
                              className={`${
                                isRecevier(senderId)
                                  ? styles.message
                                  : styles.message_sent
                              } max-w-96`}
                            >
                              {content}
                            </span>
                            <span
                              className={`text-end flex items-center justify-end gap-2 ${
                                isRecevier(senderId)
                                  ? styles.time
                                  : styles.time_sent
                              }`}
                            >
                              {returnDateOnly(sentAt)} {returnYearOnly(sentAt)}{" "}
                              {returnTime(sentAt)}
                            </span>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="flex  min-h-96 flex-col items-center justify-center">
                      {!messagesLoading && (
                        <>
                          <img
                            className={styles.notFountImg}
                            src={require("../../assets/image/not-found.png")}
                          />
                          <span className={styles.notFoundText}>
                            {t("inquiries.notFound")}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </Skeleton>
              </div>
              <div className="w-full grid grid-cols-12 py-2 items-center  gap-2">
                <div className="col-span-10">
                  <Form form={form} name="messageForm">
                    <Input
                      onPressEnter={() => {
                        const val = form.getFieldValue("message");
                        if (val?.length > 0 && selected)
                          sendMessage(val, selected?.resourceId);
                      }}
                      onClick={() => {
                        if (selected) updateList(selected?.id);
                      }}
                      name="message"
                      suffix={<Spin spinning={isSendingMessage} />}
                      prefix={
                        <Avatar
                          style={{
                            background: getRandomColor(userName ?? "A"),
                            color: colors.black,
                          }}
                        >
                          {userName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      }
                      placeholder={t("placeholder.typeMessageHere")}
                    />
                  </Form>
                </div>
                <div className="col-span-2 justify-center flex h-full">
                  <Button
                    label={t("button.send")}
                    onClick={() => {
                      const val = form.getFieldValue("message");
                      if (val?.length > 0 && selected && !isSendingMessage)
                        sendMessage(val, selected?.resourceId);
                    }}
                    btn_class="full_btn"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PrivatePageTemplate>
    </Spin>
  );
};
