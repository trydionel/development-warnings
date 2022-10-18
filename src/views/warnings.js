import React from "react";
import { DevelopmentWarnings } from "../components/DevelopmentWarnings";

aha.on("warnings",  ({ record, fields, onUnmounted }, { identifier, settings }) => {
  return <DevelopmentWarnings record={record} />
});