import { RegistrableApp } from "qiankun";

export interface TslConfig {
  type: "project" | "studio" | "uc" | "library";
  micro?: {
    enable: boolean;
    devServer?: Record<string, any>;
    register?: Array<RegistrableApp<any>>;
    prefix?: string;
  };
  main?: {
    project: "tsl-micro-dev-server";
    devServer?: Record<string, any>;
  };

  uc?: Record<string, any>;
  studio?: Record<string, any>;
  theme?: {
    packages: string[] | (() => string[]);
    color: string;
  };
  webpack?: Record<string, any> | ((webpackChain: void) => void);
}
