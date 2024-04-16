"use client";
import React from "react";

export default function CINewPage({
  params,
}: {
  params: { clusterid: string; projectid: string; serviceid: string };
}) {
  return (
    <div>
      <h1>CI New Page</h1>
      <p>Cluster ID: {params.clusterid}</p>
      <p>Project ID: {params.projectid}</p>
      <p>Service ID: {params.serviceid}</p>
    </div>
  );
}
