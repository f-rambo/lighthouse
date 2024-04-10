"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProjectServices } from "@/services/project/v1alpha1/project";
import type { Project, Service, Port } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { ServiceServices } from "@/services/service/v1alpha1/service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { setServers } from "dns";
import { select } from "@nextui-org/react";

const netProtocols = ["TCP", "UDP"];

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function Service() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const clusterid = searchParams.get("clusterid");
  const projectid = searchParams.get("projectid");
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = React.useState<Project>();
  const [serviceSearchName, setServiceSearchName] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [addEditOpen, setAddEditOpen] = React.useState(false);
  const [gpuOnOff, setGpuOnOff] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<Service>();
  const [selectedPorts, setSelectedPorts] = React.useState<Port[]>([
    {
      id: 0,
      ingress_path: "",
      container_port: 0,
      protocol: "",
    },
  ]);

  const addPortInput = () => {
    setSelectedPorts([
      ...selectedPorts,
      {
        id: selectedPorts.length,
        ingress_path: "",
        container_port: 0,
        protocol: "",
      },
    ]);
  };

  const removePortInput = (id: number) => {
    setSelectedPorts(selectedPorts.filter((item) => item.id !== id));
  };

  const projectList = React.useCallback(
    (projectid: string, clusterid: string) => {
      ProjectServices.getList(clusterid as string).then((data) => {
        if (data instanceof Error) {
          toast({
            title: "projects items fail",
            variant: "destructive",
            description: data.message,
          });
          return;
        }
        const projects = data.projects as Project[];
        setProjects(projects);
        if (projects.length == 0) {
          return;
        }
        setSelectedProject(
          projects.find((project) => project.id === projectid)
        );
      });
    },
    [toast]
  );

  const serviceList = React.useCallback(
    (projectId: string, name: string, page: number, pageSize: number) => {
      if (!projectId || projectId === "") return;
      ServiceServices.getList({
        project_id: projectId,
        name: name,
        page: page,
        page_size: pageSize,
      }).then((data) => {
        if (data instanceof Error) {
          toast({
            title: "services items fail",
            variant: "destructive",
            description: data.message,
          });
          return;
        }
      });
    },
    [toast]
  );
  React.useEffect(() => {
    projectList(projectid as string, clusterid as string);
  }, [projectList, projectid, clusterid]);

  React.useEffect(() => {
    serviceList(selectedProject?.id as string, "", page, pageSize);
  }, [serviceList, selectedProject, page, pageSize]);

  const updateSelectedService = (changes: any) => {
    setSelectedService((prevState) => ({
      id: prevState?.id || 0, // provide a default value if id is undefined
      ...prevState,
      ...changes,
    }));
  };

  const updateSelectedPort = (id: number, changes: any) => {
    setSelectedPorts((prevState) =>
      prevState.map((port) => (port.id === id ? { ...port, ...changes } : port))
    );
  };

  const sumbitService = () => {
    setAddEditOpen(false);
    if (!selectedService) return;
    console.log(selectedService);
    console.log(selectedPorts);
    console.log(gpuOnOff);
  };

  const AddEdit = () => {
    return (
      <Dialog open={addEditOpen} onOpenChange={setAddEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add New</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl h-4/5">
          <DialogHeader>
            <DialogTitle>New or edit service</DialogTitle>
            <DialogDescription>
              Add or edit a service to your project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 h-5/5 overflow-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Service name"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coderepo" className="text-right">
                Code repo
              </Label>
              <Input
                id="coderepo"
                type="url"
                placeholder="https://github.com/f-rambo/ocean"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    code_repo: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="replicas" className="text-right">
                Replicas
              </Label>
              <Input
                id="replicas"
                type="number"
                placeholder="3"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    replicas: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cpu" className="text-right">
                CPU
              </Label>
              <Input
                id="cpu"
                type="number"
                placeholder="0.5 (500m)"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    cpu: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limitcpu" className="text-right">
                Limit CPU
              </Label>
              <Input
                id="limitcpu"
                type="number"
                placeholder="3"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    limit_cpu: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memory" className="text-right">
                Memory
              </Label>
              <Input
                id="memory"
                type="number"
                placeholder="1 (1g)"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    memory: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limitmemory" className="text-right">
                Limit Memory
              </Label>
              <Input
                id="limitmemory"
                type="number"
                placeholder="3"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    limit_memory: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="disk" className="text-right">
                Disk
              </Label>
              <Input
                id="disk"
                type="number"
                placeholder="1 (1g)"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    disk: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limitdisk" className="text-right">
                Limit Disk
              </Label>
              <Input
                id="limitdisk"
                type="number"
                placeholder="3"
                className="col-span-3 w-[360px]"
                onChange={(e) =>
                  updateSelectedService({
                    limit_disk: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            {selectedPorts.map((portInput) => (
              <div
                key={portInput.id}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label
                  htmlFor={`portprotocol${portInput.id}`}
                  className="text-right"
                >
                  Port
                </Label>
                <div className="flex">
                  <Select
                    key={portInput.id}
                    onValueChange={(v) =>
                      updateSelectedPort(portInput.id, {
                        protocol: v,
                      })
                    }
                    value={
                      selectedPorts.find((port) => port.id === portInput.id)
                        ?.protocol
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="portprotocol" />
                    </SelectTrigger>
                    <SelectContent>
                      {netProtocols.map((protocol) => (
                        <SelectItem key={protocol} value={protocol}>
                          {protocol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="port"
                    placeholder="8080"
                    type="number"
                    className="col-span-3 w-[160px] ml-3"
                    onChange={(e) =>
                      updateSelectedPort(portInput.id, {
                        container_port: parseInt(e.target.value),
                      })
                    }
                  />
                  {portInput.id === 0 && (
                    <Button
                      onClick={addPortInput}
                      className="ml-3"
                      variant="outline"
                    >
                      +
                    </Button>
                  )}
                  {portInput.id !== 0 && (
                    <Button
                      onClick={() => removePortInput(portInput.id)}
                      className="ml-3"
                      variant="outline"
                    >
                      -
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-4 items-center gap-4"></div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="switchgpu" className="text-right">
                GPU On/Off
              </Label>
              <Switch id="switchgpu" onCheckedChange={setGpuOnOff} />
            </div>
            {gpuOnOff && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gpu" className="text-right">
                    GPU
                  </Label>
                  <Input
                    id="gpu"
                    type="number"
                    placeholder="1"
                    className="col-span-3 w-[360px]"
                    onChange={(e) =>
                      updateSelectedService({
                        gpu: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="limitgpu" className="text-right">
                    Limit GPU
                  </Label>
                  <Input
                    id="limitgpu"
                    type="number"
                    placeholder="3"
                    className="col-span-3 w-[360px]"
                    onChange={(e) =>
                      updateSelectedService({
                        limit_gpu: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={sumbitService}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex flex-1">
          <Input
            className="bg-white dark:bg-gray-950 max-w-sm mr-3"
            placeholder="Search services..."
            type="search"
          />
          <Select
            onValueChange={(val) =>
              setSelectedProject(
                projects.find((project) => project.name === val)
              )
            }
            value={selectedProject?.name}
          >
            <SelectTrigger className="max-w-64">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Projects</SelectLabel>
                {Array.isArray(projects) &&
                  projects?.map((project) => (
                    <SelectItem key={project.id} value={project.name}>
                      {project.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {AddEdit()}
      </div>
      <Table>
        <TableCaption>A list of your services.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
