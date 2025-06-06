import { ComponentPropsWithoutRef } from "react";

export const LoginIllustrationSVG = (
  props: ComponentPropsWithoutRef<"svg"> & { size?: number }
) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      version="1.1"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <path
        opacity="0.6"
        d="M15 2H14C11.1716 2 9.75736 2 8.87868 2.87868C8 3.75736 8 5.17157 8 8V16C8 18.8284 8 20.2426 8.87868 21.1213C9.75736 22 11.1716 22 14 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V8C21 5.17157 21 3.75736 20.1213 2.87868C19.2426 2 17.8284 2 15 2Z"
        style={{ fill: "#1C274C" }}
      />
      <path
        opacity="0.4"
        d="M8 8C8 6.46249 8 5.34287 8.14114 4.5H8C5.64298 4.5 4.46447 4.5 3.73223 5.23223C3 5.96447 3 7.14298 3 9.5V14.5C3 16.857 3 18.0355 3.73223 18.7678C4.46447 19.5 5.64298 19.5 8 19.5H8.14114C8 18.6571 8 17.5375 8 16V12.75V11.25V8Z"
        style={{ fill: "#1C274C" }}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5303 11.4697C14.8232 11.7626 14.8232 12.2374 14.5303 12.5303L12.5303 14.5303C12.2374 14.8232 11.7626 14.8232 11.4697 14.5303C11.1768 14.2374 11.1768 13.7626 11.4697 13.4697L12.1893 12.75L5 12.75C4.58579 12.75 4.25 12.4142 4.25 12C4.25 11.5858 4.58579 11.25 5 11.25L12.1893 11.25L11.4697 10.5303C11.1768 10.2374 11.1768 9.76256 11.4697 9.46967C11.7626 9.17678 12.2374 9.17678 12.5303 9.46967L14.5303 11.4697Z"
        style={{ fill: "#1C274C" }}
      />
    </svg>
  );
};
