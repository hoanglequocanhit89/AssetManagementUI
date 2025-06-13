import React, { ReactElement } from "react";
import { UserRole } from "../types/auth";
export const generateNotificationMessage = (
  type: string,
  senderName: string,
  assetName: string,
  userRole: UserRole
): ReactElement => {
  const highlight = (text: string, color: string): ReactElement => (
    <span style={{ color, fontWeight: 600 }}>{text}</span>
  );

  const senderColor = userRole === "STAFF" ? "#f59e0b" : "#1d4ed8";

  switch (type) {
    case "ASSIGNMENT_CREATED":
      return (
        <>
          {highlight(senderName, senderColor)} assigned an asset (
          {highlight(assetName, "#059669")}) for you
        </>
      );
    case "RETURN_REQUEST_CREATED":
      return (
        <>
          {highlight(senderName, senderColor)} requested you return an asset (
          {highlight(assetName, "#059669")})
        </>
      );
    case "RETURN_REQUEST_COMPLETED":
      return (
        <>
          {highlight(senderName, senderColor)} completed request for returning with asset(
          {highlight(assetName, "#059669")})
        </>
      );
    case "RETURN_REQUEST_REJECTED":
      return (
        <>
          {highlight(senderName, senderColor)} rejected your returning request for asset (
          {highlight(assetName, "#059669")})
        </>
      );
    case "ASSIGNMENT_ACCEPTED":
      return (
        <>
          {highlight(senderName, senderColor)} accepted your assignment with asset (
          {highlight(assetName, "#059669")})
        </>
      );
    case "ASSIGNMENT_REJECTED":
      return (
        <>
          {highlight(senderName, senderColor)} rejected your assignment with asset (
          {highlight(assetName, "#059669")})
        </>
      );
    default:
      return (
        <>
          {highlight(senderName, senderColor)} sent a notification about asset (
          {highlight(assetName, "#059669")})
        </>
      );
  }
};
