export enum LogLevel {
  ALL = 0,
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  VERBOSE = "verbose",
  LOG = "log",
}

export enum Frame {
  SP = "SP",
  QuickAccess = "QuickAccess",
  MainMenu = "MainMenu",
}

export interface FrameInfo {
  description: string;
  devtoolsFrontendUrl: string;
  id: string;
  title: Frame;
  type: string;
  url: string;
  webSocketDebuggerUrl: string;
}
