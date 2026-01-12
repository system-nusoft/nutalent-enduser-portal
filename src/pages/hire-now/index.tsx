import { Form, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { ProfileSuggestions, TableSearch } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import { limit } from "src/store/Endpoints";
import {
  elasticSearchLoading,
  getElasticSearchList,
  getElasticSearchMeta,
} from "src/store/selectors/features/elastic-search-selector";
import RequestAppAction from "src/store/slices/app-actions";

interface props {
  title: string;
}
export const HireNow = ({ title }: props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isLoading = useSelector(elasticSearchLoading);
  const location = useLocation();
  const list: any = useSelector(getElasticSearchList);
  const query = location?.state?.data?.search;
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState<string | undefined>("");
  const [form] = useForm();
  const [resourceList, setResourceList] = useState<any[]>([]);
  const params = new URLSearchParams(location.search);
  const search = params.get("search");
  const [loadingId, setLoadingId] = useState<null | string>(null);
  const meta = useSelector(getElasticSearchMeta);

  const onSearch = (val?: string) => {
    setSearchVal(val);
    const query: { search?: string; page: number; query?: any } = {
      page: 1,
      search: val ?? "", // if search is null sending query from upload jd or from previous search from hire now page
    };

    dispatch(
      RequestAppAction.handleGetElasticSearch({
        query,
        cbSuccess: (res) => {
          scrollRef.current?.scrollTo({ top: 0 });
          setResourceList(res?.items);
          setPage(1);
        },
      })
    );
  };

  useEffect(() => {
    if (search) {
      const query: { search?: string; page: number; query?: any } = {
        page: 1,
        search: search, // if search is null sending query from upload jd or from previous search from hire now page
      };
      dispatch(
        RequestAppAction.handleGetElasticSearch({
          query,
          cbSuccess: (res) => {
            setResourceList(res?.items);
          },
        })
      );
    } else {
      dispatch(
        RequestAppAction.handleGetElasticSearch({
          query: { page: 1, limit: limit }, //search, page is required, limit is optional,,
          cbSuccess: (res) => {
            setResourceList(res?.items);
          },
        })
      );
    }
  }, []);

  useEffect(() => {
    if (query) {
      form.setFieldValue("search", query);
    }
  }, []);

  const navigate = useNavigate();

  const onClickRow = (data: {
    id: string;
    firstName: string;
    title: string;
    lastName: string;
  }) => {
    const path = generatePath(
      ROUTES.PROFILERESOURCEBYID.replace(":id", data?.id)
    );

    navigate(path, {
      state: {
        data: {
          id: data?.id,
          firstName: data?.firstName,
          jobTitle: data?.title,
          lastName: data?.lastName,
        },
      },
    });
  };

  const scrollRef: any = useRef(null);
  const [scrollFetch, setScrollFetch] = useState(false);
  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isNearBottom) {
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
  }, [page, list]);

  useEffect(() => {
    if (scrollFetch) {
      const reqData: { search?: string; page: number } = {
        page: page + 1,
        search: searchVal, // if search is null sending query from upload jd or from previous search from hire now page
      };

      const arr = list;
      dispatch(
        RequestAppAction.handleGetElasticSearch({
          query: { ...reqData },
          cbSuccess: (res) => {
            setResourceList([...resourceList, ...res?.items]);
            setPage(page + 1);
            setScrollFetch(false);
          },
        })
      );
    }
  }, [scrollFetch]);

  const onUpdateStatus = (id: string) => {
    setLoadingId(id);
    dispatch(
      RequestAppAction.handlePostFavoriteResourceStatus({
        resourceId: id,
        cbSuccess: () => {
          setLoadingId(null);
          const updatedList = resourceList?.map(
            (i: { id: string; isFavorited: boolean }) => {
              if (i.id === id) {
                return { ...i, isFavorited: !i.isFavorited };
              } else {
                return i;
              }
            }
          );
          setResourceList(updatedList);
        },
        cbFailure: () => {
          setLoadingId(null);
        },
      })
    );
  };

  return (
    <PrivatePageTemplate title={title} description={t("hireNow.description")}>
      <Form form={form}>
        <TableSearch
          onSearch={onSearch}
          size="middle"
          fullInputWidth
          placeholder={t("placeholder.skills")}
        />
      </Form>

      <Spin spinning={isLoading}>
        <div
          ref={scrollRef}
          className="overflow-auto h-[64vh] shadow-sm shadow-gray-200 pe-2 rounded-lg"
        >
          <ProfileSuggestions
            resourceList={resourceList}
            loadingId={loadingId}
            onUpdateStatus={onUpdateStatus}
            onClickRow={onClickRow}
          />
        </div>
      </Spin>
    </PrivatePageTemplate>
  );
};
