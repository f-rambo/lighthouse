"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ActivityLogIcon, GearIcon } from "@radix-ui/react-icons";
import YamlEditor from "@focus-reactive/react-yaml";
import { ClusterServices } from "@/services/cluster/v1alpha1/cluster";
import { Cluster } from "@/types/types";
import { useRouter } from "next/navigation";
import { GitBranchIcon } from "@/components/icon";

export default function ClusterNewPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [serverConfig, setserverConfig] = useState<{}>();
  const [clusterConfig, setClusterConfig] = useState<string>("");
  const [clusterAddons, setClusterAddons] = useState<string>("");
  let clusterMockApiNumber = 0;
  useEffect(() => {
    if (clusterMockApiNumber > 0) {
      return;
    }
    clusterMockApiNumber++;
    ClusterServices.getClusterMockData().then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Error",
          description: "Error while fetching cluster data",
          duration: 5000,
        });
        return;
      }
      const cluster = res as Cluster;
      if (!cluster.nodes || cluster.nodes.length === 0) {
        toast({
          title: "Error",
          description: "Cluster has no nodes",
          duration: 5000,
        });
        return;
      }
      const node = cluster.nodes[0];
      setserverConfig({
        name: cluster?.name,
        api_server_address: cluster?.api_server_address,
        nodes: [
          {
            name: node?.name,
            external_ip: node?.external_ip,
            user: node?.user,
            password: node?.password,
            sudo_password: node?.sudo_password,
            role: node?.role,
          },
        ],
      });
      setClusterConfig(cluster?.config);
      setClusterAddons(cluster?.addons);
    });
  }, [toast, clusterMockApiNumber]);

  const startDeploy = () => {
    let clusterData = serverConfig as Cluster;
    clusterData.config = clusterConfig;
    clusterData.addons = clusterAddons;
    ClusterServices.saveCluster(clusterData).then((res) => {
      if (res instanceof Error) {
        toast({
          title: "Error",
          description: "Error while saving cluster data",
          duration: 5000,
          variant: "destructive",
        });
        return;
      }
      const cluster = res as Cluster;
      ClusterServices.setUpCluster(cluster.id).then((res) => {
        if (res instanceof Error) {
          toast({
            title: "Error",
            description: "Error while setting up cluster",
            duration: 5000,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "New cluster",
          description: "Deploying the cluster...",
          duration: 5000,
        });
        router.push(`/cluster/list/detail?clusterid=${cluster.id}`);
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <GearIcon className="h-12 w-12" />
              <h1 className="text-2xl font-bold">Cluster configure</h1>
            </div>
            <p className="text-gray-600">
              Here configure the server information, cluster configuration,
              cluster plugin.
            </p>
            <Tabs className="w-full" defaultValue="cluster-configuration">
              <TabsList className="flex gap-4">
                <TabsTrigger value="server-configuration">
                  Server configuration
                </TabsTrigger>
                <TabsTrigger value="cluster-configuration">
                  Cluster configuration
                </TabsTrigger>
                <TabsTrigger value="cluster-addons">Cluster addons</TabsTrigger>
              </TabsList>
              <TabsContent value="server-configuration">
                <div className="p-4 overflow-y-auto h-screen">
                  <YamlEditor
                    json={serverConfig}
                    onChange={(e) => setserverConfig(e.json)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="cluster-configuration">
                <div className="p-4 overflow-y-auto h-screen">
                  <YamlEditor
                    text={clusterConfig}
                    onChange={(e) => setClusterConfig(e.text)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="cluster-addons">
                <div className="p-4 overflow-y-auto h-screen">
                  <YamlEditor
                    text={clusterAddons}
                    onChange={(e) => setClusterAddons(e.text)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="flex items-center mt-2">
                <ActivityLogIcon className="h-6 w-6 mr-3" />
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => startDeploy()}
                >
                  Start deploy...
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-semibold">Tools</h3>
              <div className="flex items-center mt-2">
                <GitBranchIcon className="h-6 w-6 mr-3" />
                <p className="ml-2 text-gray-600">Kubespray-v2.24.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
