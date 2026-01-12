import { Divider } from "antd";
import styles from "./styles.module.scss";

export const Card = ({
  childern,
  style,
}: {
  childern: { title?: string; content: JSX.Element }[];
  style?: string;
}) => {
  return (
    <div
      className={`grid grid-cols-${childern?.length}  ${
        style ? style : "p-5 bg-white border"
      }  rounded-xl gap-5`}
    >
      {childern?.map(({ title, content }) => (
        <div>
          {title && (
            <div className={styles.title}>
              {title}
              <Divider />
            </div>
          )}
          {content}
        </div>
      ))}
    </div>
  );
};
