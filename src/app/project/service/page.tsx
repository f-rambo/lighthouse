"use client";
import { useSearchParams } from "next/navigation";

export default function Service() {
  const searchParams = useSearchParams();
  const clusterid = searchParams.get("clusterid");
  const projectid = searchParams.get("projectid");
  return (
    <div>
      clusterid : {clusterid} projectid : {projectid}
    </div>
  );
}
