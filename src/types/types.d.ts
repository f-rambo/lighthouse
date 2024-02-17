import React, { ReactNode } from 'react';

type ChildContainerProps = {
      children: ReactNode;
};

type User = {
      id: string;
      name: string;
      email: string;
}


type AppType = {
      id: string;
      name: string;
}

type AppHelmRepo = {
      id: string;
      name: string;
      url: string;
      description: string;
}
  
type App = {
      id: string;
      name: string;
      icon: string;
      app_type_id: string;
      app_type_name: string;
      app_helm_repo_id: string;
      versions: AppVersion[];
      update_time: string;
}

type AppVersion = {
      id: string;
      app_id: string;
      app_name: string;
      name: string;
      chart: string;
      version: string;
      config: string;
      readme: string;
      state: string;
      test_result: string;
      description: string;
      metadata: Metadata;
}

type Metadata = {
      name: string;
      home: string;
      sources: string[];
      version: string;
      description: string;
      keywords: string[];
      maintainers: Maintainer[];
      icon: string;
      apiVersion: string;
      condition: string;
      tags: string;
      appVersion: string;
      deprecated: boolean;
      annotations: Record<string, string>;
      kubeVersion: string;
      dependencies: Dependency[];
      type: string;
}

type Maintainer = {
      name: string;
      email: string;
      url: string;
}

type Dependency = {
      name: string;
      version: string;
      repository: string;
      condition: string;
      tags: string[];
      enabled: boolean;
      importValues: string[];
      alias: string;
}
