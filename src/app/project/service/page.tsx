"use client";
import { useSearchParams } from "next/navigation";

export default function Service() {
  const searchParams = useSearchParams();
  const clusterid = searchParams.get("clusterid");
  const projectid = searchParams.get("projectid");
  return (
    <div>
      clusterid : {clusterid} projectid : {projectid}
      在新建service的时候就需要确定 ci 和 cd 的类型，然后选择对应的模板。
    </div>
  );
}
