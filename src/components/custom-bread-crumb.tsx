// This component renders a breadcrumb navigation

import { Home } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import React from "react";

interface CustomBreadCrumbProps {
    breadCrumbPage: string;
    breadCrumbItems?: {link: string; label: string}[];
}

const CustomBreadCrumb = ({ breadCrumbPage, breadCrumbItems }: CustomBreadCrumbProps) => {
  return (
    <Breadcrumb>
    <BreadcrumbList>
        <BreadcrumbItem>
            <BreadcrumbLink
                href="/"
                className="flex items-center justify-center hover:text-text-indigo-500"
            >
                <Home className="w-3 h-3 mr-2"/> Home
            </BreadcrumbLink>
        </BreadcrumbItem>
        {breadCrumbItems && breadCrumbItems.map((item, i) => (
            <React.Fragment key={i}>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>
                    <BreadcrumbLink
                        href={item.link}
                        className="hover:text-indigo-500"
                    >
                        {item.label}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </React.Fragment>
        ))}
        <BreadcrumbSeparator/>
        <BreadcrumbItem>
            <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
        </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
  )
}

export default CustomBreadCrumb