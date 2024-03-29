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

type Repositorie = {
      id: string;
      name: string;
      url: string;
      description: string;
}

type Cluster = {
      id: string;
      name: string;
      server_version: string;
      api_server_address: string;
      config: string;
      addons: string;
      addons_config: string;
      state: string;
      nodes: Node[];
      logs: string;
};

type Node = {
      id: string;
      name: string;
      labels: string;
      annotations: string;
      os_image: string;
      kernel: string;
      container: string;
      kubelet: string;
      kube_proxy: string;
      internal_ip: string;
      external_ip: string;
      user: string;
      password: string;
      sudo_password: string;
      role: string;
      state: string;
      cluster_id: number;
};

type Project = {
      id: string;
      name: string;
      description: string;
      cluster_id: string;
      namespace: string;
      state: string;
      business_types: BusinessType[];
      business_technology: string;
};

type BusinessType = {
      id: string;
      name: string;
      technology_types: TechnologyType[];
};

type TechnologyType = {
      id: string;
      name: string;
};