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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Project } from "@/types/types";
import { ProjectServices } from "@/services/project/v1alpha1/project";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

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
  }, [refreshProjectList]);

  const [AddEditProjectOpen, setAddEditProjectOpen] = React.useState(false);
  const [editProject, setEditProject] = React.useState<Project | null>(null);

  function AddEditProject() {
    const saveProject = () => {
      if (editProject?.id === "") {
        editProject.id = "0";
      }
      ProjectServices.save(editProject).then((data) => {
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
        if (Number(editProject?.id) > 0) {
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
          <Button variant="outline" onClick={() => setEditProject(null)}>
            Add New
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
                value={editProject?.name}
                onChange={(e) => {
                  setEditProject((prevRepositorie) => ({
                    ...prevRepositorie,
                    name: e.target.value,
                    id: prevRepositorie?.id || "",
                    namespace: prevRepositorie?.namespace || "",
                    description: prevRepositorie?.description || "",
                    cluster_id: clusterid || "",
                  }));
                }}
                placeholder="Project name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                Namespace
              </Label>
              <Input
                id="url"
                placeholder="kubernete namespace"
                className="col-span-3"
                value={editProject?.namespace}
                onChange={(e) => {
                  setEditProject((prevRepositorie) => ({
                    ...prevRepositorie,
                    namespace: e.target.value,
                    id: prevRepositorie?.id || "",
                    name: prevRepositorie?.name || "",
                    description: prevRepositorie?.description || "",
                    cluster_id: clusterid || "",
                  }));
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                className="col-span-3"
                id="description"
                placeholder="Type your message here."
                value={editProject?.description}
                onChange={(e) => {
                  setEditProject((prevRepositorie) => ({
                    ...prevRepositorie,
                    description: e.target.value,
                    id: prevRepositorie?.id || "",
                    name: prevRepositorie?.name || "",
                    namespace: prevRepositorie?.namespace || "",
                    cluster_id: clusterid || "",
                  }));
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setAddEditProjectOpen(true);
                  setEditProject((prevRepositorie) => ({
                    ...prevRepositorie,
                    name: project.name,
                    id: project.id,
                    namespace: project.namespace,
                    description: project.description,
                    cluster_id: clusterid as string,
                  }));
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => projectDelete(project.id)}>
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
          placeholder="Filter repositories..."
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
