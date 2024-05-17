import { auth } from "@/auth"
import {Session } from "next-auth"

export const dynamic = 'force-dynamic'

const backendUrl = `${process.env.NEXT_PUBLIC_API ?? ""}${
       process.env.NEXT_PUBLIC_API_VERSION ?? ""
     }`;

export async function GET(request: Request) {
   const session = await auth() as Session;
   
   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');
   // 构建新的请求
   const newUrl = backendUrl+url.pathname ; // 新的地址
   const newHeaders = new Headers(request.headers); // 复制原始请求的headers
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);

   // 发送转发后的请求
   const forwardedResponse = await fetch(newUrl, {
     method: 'GET',
     headers: newHeaders,
   });

   // 返回转发后的响应
   return forwardedResponse;
}

export async function POST(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');
   // 构建新的请求
   const newUrl = backendUrl+url.pathname ; // 新的地址
   const newHeaders = new Headers(request.headers); // 复制原始请求的headers
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);

   // 发送转发后的请求
   const forwardedResponse = await fetch(newUrl, {
     method: 'POST',
     headers: newHeaders,
     body: await request.clone().text(),
   });

   // 返回转发后的响应
   return forwardedResponse;
}

export async function PUT(request: Request) {
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');
   // 构建新的请求
   const newUrl = backendUrl+url.pathname ; // 新的地址
   const newHeaders = new Headers(request.headers); // 复制原始请求的headers
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);

   // 发送转发后的请求
   const forwardedResponse = await fetch(newUrl, {
     method: 'PUT',
     headers: newHeaders,
     body: await request.clone().text(),
   });

   // 返回转发后的响应
   return forwardedResponse;
}

export async function DELETE(request: Request) { 
   const session = await auth() as Session;

   const url = new URL(request.url);
   url.pathname = url.pathname.replace(/\/.*\/backend/, '');
   // 构建新的请求
   const newUrl = backendUrl+url.pathname ; // 新的地址
   const newHeaders = new Headers(request.headers); // 复制原始请求的headers
   newHeaders.append('Authorization', session.provider+' '+session.accessToken);
   newHeaders.append('User-Email', session?.user?.email as string);

   // 发送转发后的请求
   const forwardedResponse = await fetch(newUrl, {
     method: 'DELETE',
     headers: newHeaders,
   });

   // 返回转发后的响应
   return forwardedResponse;
}

