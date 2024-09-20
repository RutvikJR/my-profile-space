import { Title } from "@mantine/core";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function PageTitle({ title }: { title: string }) {
  return (
    <div>
      <div className="flex justify-start items-center gap-2">
        <Link to={"/"}>
          <IconArrowLeft stroke={2} />
        </Link>
        <Link to={"/"}>
          <span>Home</span>
        </Link>
        <IconChevronRight stroke={2} size={20} /> <span>{title}</span>
      </div>
      <div className="flex justify-center items-center">
        <Title>{title}</Title>
      </div>
    </div>
  );
}
