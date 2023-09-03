import { Skeleton } from "@mui/material";

function CardSkeletonWide() {
  return (
    <>
      <Skeleton animation="wave" height={230} sx={{ display: "block" }} width={700} />
    </>
  );
}

export default CardSkeletonWide;
