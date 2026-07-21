export type NavItem = {
  title: string;
  href?: string;
  children?: NavItem[];
};

export const navigation: NavItem[] = [
  {
    title: "CDP Private Cloud",
    children: [
      {
        title: "Installations",
        children: [
          { title: "Overview", href: "/installations" },
          {
            title: "CDP 7.1.7",
            children: [
              { title: "Overview", href: "/installations/cdp-7-1-7" },
              {
                title: "CDP Private Cloud Overview",
                href: "/installations/cdp-7-1-7/cdppvc/cdppvc",
              },
              { title: "Demo Architecture", href: "/installations/cdp-7-1-7/cdppvc/demo" },
              {
                title: "Installation Prerequisites",
                href: "/installations/cdp-7-1-7/cdppvc/prerequisites",
              },
              { title: "Cloudera Manager Deployment", href: "/installations/cdp-7-1-7/cdppvc/cm" },
              {
                title: "Base Cluster (Data Lake)",
                children: [
                  { title: "Overview", href: "/installations/cdp-7-1-7/cdppvc/base" },
                  { title: "Base Deployment", href: "/installations/cdp-7-1-7/cdppvc/basedeploy" },
                  { title: "Base Post-Deployment", href: "/installations/cdp-7-1-7/cdppvc/baseconfig" },
                ],
              },
              { title: "ECS Deployment", href: "/installations/cdp-7-1-7/cdppvc/ecs" },
              {
                title: "Openshift Deployment",
                children: [
                  { title: "Overview", href: "/installations/cdp-7-1-7/cdppvc/ocp" },
                  { title: "Docker Registry in Nexus", href: "/installations/cdp-7-1-7/cdppvc/nexus" },
                  { title: "Vault Deployment", href: "/installations/cdp-7-1-7/cdppvc/vault" },
                  {
                    title: "CDP Data Services Control Plane on Openshift",
                    href: "/installations/cdp-7-1-7/cdppvc/dsocp",
                  },
                ],
              },
              {
                title: "CDP PvC Data Services",
                children: [
                  { title: "Overview", href: "/installations/cdp-7-1-7/cdppvc/ds" },
                  { title: "Data Services Console", href: "/installations/cdp-7-1-7/cdppvc/dsconsole" },
                  { title: "Cloudera Machine Learning", href: "/installations/cdp-7-1-7/cdppvc/cmlds" },
                  {
                    title: "Cloudera Data Warehouse (ECS)",
                    href: "/installations/cdp-7-1-7/cdppvc/cdwecs",
                  },
                  {
                    title: "Cloudera Data Warehouse (Openshift)",
                    href: "/installations/cdp-7-1-7/cdppvc/cdwocp",
                  },
                  {
                    title: "Cloudera Data Engineering (ECS)",
                    href: "/installations/cdp-7-1-7/cdppvc/cdeecs",
                  },
                  {
                    title: "Cloudera Data Engineering (Openshift)",
                    href: "/installations/cdp-7-1-7/cdppvc/cdeocp",
                  },
                ],
              },
              {
                title: "CDP PvC ECS: Day-2",
                children: [
                  { title: "Overview", href: "/installations/cdp-7-1-7/cdppvc/ecsday2" },
                  { title: "Setup ECS Environment", href: "/installations/cdp-7-1-7/cdppvc/ecsenv" },
                  { title: "Deploy LVM Disk", href: "/installations/cdp-7-1-7/cdppvc/lvm" },
                  { title: "Add ECS Node", href: "/installations/cdp-7-1-7/cdppvc/addecs" },
                  { title: "Deploy Nvidia GPU in ECS", href: "/installations/cdp-7-1-7/cdppvc/gpuecs" },
                ],
              },
              {
                title: "CDP PvC Openshift: Day-2",
                children: [
                  { title: "Overview", href: "/installations/cdp-7-1-7/cdppvc/ocpday2" },
                  {
                    title: "Deploy CDW Disk in Openshift",
                    href: "/installations/cdp-7-1-7/cdppvc/ocpcdwdisk",
                  },
                  {
                    title: "Deploy Nvidia GPU in Openshift",
                    href: "/installations/cdp-7-1-7/cdppvc/gpuocp",
                  },
                ],
              },
              {
                title: "Expand Longhorn Disk Space",
                href: "/installations/cdp-7-1-7/cdppvc/longhornscale",
              },
              {
                title: "Data Warehousing",
                children: [
                  { title: "Overview", href: "/installations/cdp-7-1-7/cdw/cdw" },
                  {
                    title: "Parquet, ORC, Avro and CSV Benchmarking",
                    href: "/installations/cdp-7-1-7/cdw/benchmarkfs",
                  },
                  { title: "SNAPPY Compression", href: "/installations/cdp-7-1-7/cdw/snappy" },
                  { title: "Auto-scaling in CDW", href: "/installations/cdp-7-1-7/cdw/cdwautoscaling" },
                ],
              },
              {
                title: "Longhorn",
                children: [
                  { title: "Overview", href: "/installations/cdp-7-1-7/longhorn/longhorn" },
                  {
                    title: "Performance Benchmarking",
                    href: "/installations/cdp-7-1-7/longhorn/benchmarking",
                  },
                ],
              },
              {
                title: "Machine Learning",
                children: [
                  { title: "Overview", href: "/installations/cdp-7-1-7/cml/cml" },
                  { title: "Threading in Python", href: "/installations/cdp-7-1-7/cml/mthread" },
                  { title: "Multiprocessing in Python", href: "/installations/cdp-7-1-7/cml/mprocess" },
                  { title: "Image Processing", href: "/installations/cdp-7-1-7/cml/imagep" },
                  { title: "Noisy Neighbour", href: "/installations/cdp-7-1-7/cml/noisyneighbour" },
                  { title: "Ray", href: "/installations/cdp-7-1-7/cml/ray" },
                  { title: "Custom Docker Image", href: "/installations/cdp-7-1-7/cml/customimage" },
                  { title: "Pytorch", href: "/installations/cdp-7-1-7/cml/pytorch" },
                  { title: "Nvidia GPU Dashboard", href: "/installations/cdp-7-1-7/cml/nvdashboard" },
                  { title: "Tensorflow", href: "/installations/cdp-7-1-7/cml/tensorflow" },
                  { title: "Dask", href: "/installations/cdp-7-1-7/cml/dask" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "CDP Public Cloud",
    href: "/cdp-public-cloud",
  },
];
