export type Template = {
  template: {
    [key: string]: {
      packages: string;
      dir: string;
    };
  };
  theme: {
    [key: string]: {
      template: string[];
    };
  };
};

export type TslCli = {
  template?: string;
  branch?: string;
  micro_template?: string;
  micro_branch?: string;
};
