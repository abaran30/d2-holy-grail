import * as React from "react";
import { createStyles, WithStyles, withStyles, Typography } from "@material-ui/core";
import { GrailManager } from "./GrailManager";
import { IGrailData } from "../../common/definitions/api/IGrailData";
import { ChangeDiscarder } from "./dataManipulation/clickable-components/ChangeDiscarder";
import { GrailToServerSaver } from "./dataManipulation/clickable-components/GrailToServerSaver";
import { ExportListItem } from "./dataManipulation/clickable-components/ExportListItem";
import { IGrailError } from "./IGrailError";

export interface IGrailErrorHandlerProps {
  error: IGrailError;
}

type Props = IGrailErrorHandlerProps & WithStyles<typeof styles>;

const GrailErrorHandlerInternal: React.FunctionComponent<Props> = props => {
  return (
    <div className={props.classes.container}>
      <Typography variant="body1">{getErrorMessage(props.error)}</Typography>
      {props.error.type === "conflict" && <ConflictHandler error={props.error} />}
    </div>
  );
};

const ConflictHandler: React.FunctionComponent<IGrailErrorHandlerProps> = props => {
  return (
    <div>
      <ChangeDiscarder renderAsListItem={true} text="Discard local changes and use server data" />
      <GrailToServerSaver
        renderAsListItem={true}
        text="Ignore server changes and use local data"
        token={props.error.serverToken}
        reload={true}
      />
      You can also download backups of all data and compare them locally:
      <ExportListItem
        text="Download local data"
        fileName="Local Data"
        data={
          {
            grailData: GrailManager.current.normalGrail,
            ethData: GrailManager.current.ethGrail,
            runewordData: GrailManager.current.runewordGrail
          } as IGrailData
        }
      />
      <ExportListItem text="Download server data" fileName="Server Data" data={props.error.serverData} />
    </div>
  );
};

function getErrorMessage(error: IGrailError) {
  if (error.status === 404) {
    return `No Holy Grail for the address '${GrailManager.current.address}' exists!`;
  }

  if (error.type === "conflict") {
    return (
      "There was a conflict! The server data changed, but you also have local changes." +
      " Please choose one of the following actions:"
    );
  }

  return "There was an error getting the Holy Grail Data from the server. Please try again.";
}

const styles = () =>
  createStyles({
    container: {
      maxWidth: "700px",
      margin: "auto"
    }
  });

export const GrailErrorHandler = withStyles(styles)(GrailErrorHandlerInternal);
