import { MjmlHead, MjmlPreview, MjmlStyle, MjmlTitle } from "@faire/mjml-react";
import { readFileSync } from "fs";
import React from "react";

// const css = readFileSync("resources/views/assets/style.css").toString();
const css = `.default-bg{background-color:#d1deec}.card,.footer,.header{background-color:#f5f6f6}.card{border-radius:8px;margin-left:20px;margin-right:20px}.styled-table{font-size:.9em;font-family:sans-serif;border-radius:10em;overflow:hidden}.styled-table thead tr{background-color:#3577f12e;color:#343a40;text-align:left}.styled-table td,.styled-table th{padding:12px 15px}.styled-table tbody tr{border-bottom:2px solid #ddd}.styled-table tbody tr:nth-of-type(2n){background-color:#f3f3f3}.styled-table tbody tr:last-of-type{border-bottom:2px solid #0275d8}.styled-table tbody tr.active-row{font-weight:700;color:#2d94f3}`;

export const MailmanHead = (payload: Record<string, any>) => {
  return (
    <MjmlHead>
      <MjmlTitle>{payload.title}</MjmlTitle>
      <MjmlPreview>{payload.preview || payload.title}</MjmlPreview>
      <MjmlStyle>{css}</MjmlStyle>
    </MjmlHead>
  );
};
