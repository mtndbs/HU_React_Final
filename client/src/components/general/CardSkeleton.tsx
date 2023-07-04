import { Skeleton, Stack } from "@mui/material";

function CardSkeleton() {
  //   return <Skeleton sx={{ height: 370, width: 345 }} animation="wave" variant="rectangular" />;
  return (
    <>
      <Stack spacing={1}>
        <Skeleton
          animation="wave"
          height={20}
          sx={{ display: "inline", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
          width={300}
        />
        <Skeleton variant="circular" width={35} height={35} sx={{ display: "inline-block" }} />
        <Skeleton variant="rectangular" width={300} height={200} />
        <Skeleton variant="rounded" width={300} height={70} />
      </Stack>
    </>
  );
}

export default CardSkeleton;
