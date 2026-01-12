import { Spin } from "antd";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import { BlueInfoIcon, Plus } from "src/assets";
import { Button, Input, Table, TableSearch, Tag } from "src/components";
import { DialogBox } from "src/components/modal/Modal";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ROUTES } from "src/constants/navigation-routes";
import { getInterviewList } from "src/store/selectors/features/interview-selector";
import { modalProps } from "src/utils/enum";
import styles from "./styles.module.scss";

interface props {
  title: string;
}

interface data {
  page?: number;
  search?: string;
}
export const WalletListing = ({ title }: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useSelector(getInterviewList);
  const modalRef = useRef<modalProps>(null);
  const columns: any = [
    {
      title: <span className="ms-5">{t("table.column.deposit")}</span>,
      key: "deposit",
      dataIndex: "deposit",
      render: (name: string) => {
        return <span className="ms-5">{name}</span>;
      },
    },
    {
      title: t("table.column.payment"),
      key: "payment",
      dataIndex: "payment",
    },
    {
      title: t("table.column.depositDate"),
      key: "issueDate",
      dataIndex: "issueDate",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              weekday: "long",
            })}
          </span>
        );
      },
    },

    {
      title: t("table.column.transferCompletion"),
      key: "type",
      dataIndex: "type",
      render: (name: string) => {
        const date = new Date(name);
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              weekday: "long",
            })}
          </span>
        );
      },
    },
    {
      title: t("table.column.status"),
      key: "status",
      dataIndex: "status",
      render: (status: any) => (
        <>
          {status ? (
            <Tag label={status} tagType={status?.toString()?.toLowerCase()} />
          ) : (
            "-"
          )}
        </>
      ),
    },
  ];

  const onClickRow = (record: any) => {
    const path = generatePath(ROUTES.INVOICEBYID.replace(":id", record.name));

    navigate(path, {
      state: {
        data: record,
      },
    });
  };

  const onChangePage = () => {};

  const onSearch = () => {};

  const keyValues = [
    { name: t("labels.beneficiaryName"), value: "value" },
    { name: t("labels.beneficiaryAddress"), value: "value" },
    { name: t("labels.accountNumber"), value: "value" },
    { name: t("labels.swiftBicCode"), value: "value" },
    { name: t("labels.routingNumber"), value: "value" },
    { name: t("labels.recipientBankName"), value: "value" },
    { name: t("labels.recipientAddress"), value: "value" },
    { name: t("labels.referenceCode"), value: "value" },
  ];

  return (
    <Spin spinning={false}>
      <PrivatePageTemplate
        buttons={[
          {
            onClick: () => {
              modalRef.current?.openModal();
            },
            icon: <Plus />,
            label: t("button.addFunds"),
          },
        ]}
        title={title}
      >
        <div className="white-container">
          <div className="flex gap-6 ">
            <div>
              <div className="flex flex-col gap-2">
                <div className={styles.card_mini_heading}>
                  {t("labels.availableFunds")}
                </div>
                <div className={styles.card_desc}>$1000</div>
              </div>
            </div>

            <div className="border border-l-2 border-t-0 border-b-0 border-r-0 ps-6">
              <div className="flex flex-col gap-2">
                <div className={styles.card_mini_heading}>
                  {t("labels.inTransit")}
                </div>
                <div className={styles.card_desc}>$1000</div>
              </div>
            </div>
          </div>
        </div>
        <TableSearch onSearch={onSearch} />
        <Table
          loading={false}
          columns={columns}
          dataSource={data ?? []}
          pagination={{
            onChange: onChangePage,
            total: 0,
          }}
          heightAdjuster={20}
          handleRowClick={onClickRow}
        />
        <DialogBox ref={modalRef}>
          <div className="flex flex-col gap-6 mt-2">
            <div className={styles.modal_heading}>
              {t("labels.receivingBankDetails")}
            </div>
            <div className="flex flex-col gap-2">
              {keyValues?.map(({ name, value }) => (
                <div className="grid grid-cols-6 gap-8">
                  <div className={`col-span-2 ${styles.modal_key}`}>{name}</div>
                  <div className={`col-span-4 ${styles.modal_value}`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Input
              name="details"
              inputType="normal"
              size="small"
              placeholder={t("placeholder.addDepositAmount")}
            />
          </div>
          <div className="flex gap-4 w-full my-6">
            <Button btn_class="white_full_btn" label={t("button.cancel")} />
            <Button btn_class="full_btn" label={t("button.doneTranfer")} />
          </div>
          <div className={styles.info}>
            <div className="flex gap-4 p-2 justify-center items-center">
              <div>
                <BlueInfoIcon />
              </div>
              <div className={styles.text}>{t("labels.invoiceSentDesc")}</div>
            </div>
          </div>
        </DialogBox>
      </PrivatePageTemplate>
    </Spin>
  );
};
