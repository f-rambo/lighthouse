"use client";
import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Project, TechnologyType, BusinessType } from "@/types/types";
import { ProjectServices } from "@/services/project/v1alpha1/project";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AppRepoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const searchParams = useSearchParams();
  const clusterid = searchParams.get("clusterid");
  const [data, setData] = React.useState<Project[]>([]);
  const [projectMockData, setProjectMockData] = React.useState<Project | null>(
    null
  );
  const [technologyTypes, setTechnologyTypes] = React.useState<
    TechnologyType[]
  >([]);
  const [selectedTechnologyTypeid, setSelectedTechnologyTypeid] =
    React.useState<string>("");
  const [selectedBusinessTypeid, setSelectedBusinessTypeid] =
    React.useState<string>("");

  const onBusinessTypeChange = (selectedBusinessTypeid: string) => {
    if (selectedBusinessTypeid === "") {
      return;
    }
    setSelectedBusinessTypeid(selectedBusinessTypeid);
    const technologyTypeItems = projectMockData?.business_types.find(
      (v) => v.id === selectedBusinessTypeid
    )?.technology_types;
    if (technologyTypeItems === undefined) {
      return;
    }
    console.log(technologyTypeItems);
    setTechnologyTypes(technologyTypeItems);
  };

  const getProjectMockData = React.useCallback(() => {
    if (projectMockData !== null) {
      return;
    }
    ProjectServices.getProjectMockData().then((data) => {
      if (data instanceof Error) {
        toast({
          title: "project items fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      setProjectMockData(data as Project);
    });
  }, [toast, projectMockData]);

  const refreshProjectList = React.useCallback(() => {
    ProjectServices.getList(clusterid as string).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "project items fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      setData(data.projects as Project[]);
    });
  }, [toast, clusterid]);

  React.useEffect(() => {
    refreshProjectList();
    getProjectMockData();
  }, [refreshProjectList, getProjectMockData]);

  const [AddEditProjectOpen, setAddEditProjectOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState("");
  const [projectNamespace, setProjectNamespace] = React.useState("");
  const [projectDescription, setProjectDescription] = React.useState("");
  const [projectid, setProjectid] = React.useState("");

  function AddEditProject() {
    const saveProject = () => {
      const technologyTypeData = technologyTypes?.find(
        (v) => v.id === selectedTechnologyTypeid
      );
      const businessTypeData = projectMockData?.business_types.find(
        (v) => v.id === selectedBusinessTypeid
      );
      const projectData: Project = {
        id: projectid,
        name: projectName,
        namespace: projectNamespace,
        description: projectDescription,
        state: "",
        cluster_id: clusterid as string,
        business_types: [businessTypeData as BusinessType],
        business_technology: "",
      };
      if (projectData.id === "") {
        projectData.id = "0";
      }
      projectData.business_types[0].technology_types = [
        technologyTypeData as TechnologyType,
      ];
      ProjectServices.save(projectData).then((data) => {
        if (data instanceof Error) {
          toast({
            title: "project saveing fail",
            variant: "destructive",
            description: data.message,
          });
          return;
        }
        refreshProjectList();
        let descriptionMsg = "add success";
        if (Number(projectData?.id) > 0) {
          descriptionMsg = "edit success";
        }
        toast({
          title: "project",
          description: descriptionMsg,
        });
      });
    };

    return (
      <Dialog open={AddEditProjectOpen} onOpenChange={setAddEditProjectOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add New</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>project</DialogTitle>
            <DialogDescription>
              Make changes to Project here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
                placeholder={projectMockData?.name}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                Namespace
              </Label>
              <Input
                id="url"
                placeholder={projectMockData?.namespace}
                className="col-span-3"
                value={projectNamespace}
                onChange={(e) => {
                  setProjectNamespace(e.target.value);
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">BusinessTypes</Label>
              <Select required onValueChange={(v) => onBusinessTypeChange(v)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a business type" />
                </SelectTrigger>
                <SelectContent>
                  {projectMockData?.business_types.map((businessType) => (
                    <SelectItem key={businessType.id} value={businessType.id}>
                      {businessType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">TechnologyTypes</Label>
              <Select
                required
                onValueChange={(v) => setSelectedTechnologyTypeid(v)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a technology type" />
                </SelectTrigger>
                <SelectContent>
                  {technologyTypes?.map((technologyType) => (
                    <SelectItem
                      key={technologyType.id}
                      value={technologyType.id}
                    >
                      {technologyType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                className="col-span-3"
                id="description"
                placeholder="Type your message here."
                value={projectDescription}
                onChange={(e) => {
                  setProjectDescription(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={saveProject}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const projectDelete = (id: string) => {
    ProjectServices.delete(id).then((data) => {
      if (data instanceof Error) {
        toast({
          title: "project delete fail",
          variant: "destructive",
          description: data.message,
        });
        return;
      }
      refreshProjectList();
    });
  };

  const columns: ColumnDef<Project>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize ml-4">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "cluster_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cluster ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize ml-4">{row.getValue("cluster_id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize ml-4">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "namespace",
      header: "Namespace",
      cell: ({ row }) => <div>{row.getValue("namespace")}</div>,
    },
    {
      accessorKey: "business_technology",
      header: "Business Type/Technology Type",
      cell: ({ row }) => <div>{row.getValue("business_technology")}</div>,
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("state")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: () => <div>Description</div>,
      cell: ({ row }) => {
        const description = row.getValue("description");
        const truncatedDescription =
          typeof description === "string" && description.length > 60
            ? description.substring(0, 60) + "..."
            : description;
        return (
          <div className="font-medium">{truncatedDescription as string}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const project = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(project.id)}
              >
                Copy project ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    "/project/service?clusterid=" +
                      clusterid +
                      "&projectid=" +
                      project.id
                  )
                }
              >
                View Services
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    "/project/service?clusterid=" +
                      clusterid +
                      "&projectid=" +
                      project.id
                  )
                }
              >
                View Apps
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.state === "running"}
                onClick={() => console.log("启动项目，开始安装项目组件")}
              >
                Enable
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.state !== "running"}
                onClick={() => console.log("停止项目，停止项目组件")}
              >
                UnEnable
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setAddEditProjectOpen(true);
                  setProjectid(project.id);
                  setProjectName(project.name);
                  setProjectNamespace(project.namespace);
                  setProjectDescription(project.description);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={project.state === "running"}
                onClick={() => projectDelete(project.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter projects..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto mr-3">
              Columns <ChevronDownIcon className="ml-2  h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {AddEditProject()}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              className="ml-3"
              variant="outline"
              size="sm"
              onClick={() => {
                const selectedIds = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.id);
                // Use selectedIds for further processing
                console.log(selectedIds);
              }}
            >
              Delete selected
            </Button>
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
