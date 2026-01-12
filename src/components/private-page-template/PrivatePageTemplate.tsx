import { PageHeader } from "../page-header/PageHeader";

interface buttonProp {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: { text: string };
  btn_class?:
    | "filled_btn_large"
    | "filled_btn"
    | "white_btn"
    | "transparent_btn"
    | "card_grey_btn";
}

interface props {
  title?: string;
  description?: string | ReactNode;
  center?: boolean;
  children: React.ReactNode;
  buttons?: buttonProp[] | false;
  avatar?: { name: string; img: string | undefined } | undefined;
  img?: string;
  backBtn?: boolean;
  tabs?: {
    data: { id: number; label: string; path: string; toolTipText?: string }[];
    onClick: (id: number) => void;
  };
}
export const PrivatePageTemplate = ({
  title,
  description,
  center,
  children,
  buttons,
  avatar,
  img,
  tabs,
  backBtn,
}: props) => {
  return (
    <div className="flex flex-col px-14 mt-2 gap-4">
      <PageHeader
        img={img}
        title={title}
        tabs={tabs}
        description={description}
        center={center}
        avatar={avatar}
        buttons={buttons}
        backBtn={backBtn}
      />
      <div className="flex flex-col gap-4 pb-16 overflow-auto scroll-smooth">
        {children}
      </div>
    </div>
  );
};
