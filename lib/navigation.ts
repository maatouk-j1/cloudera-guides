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
          {
            title: "CDP 7.1.7",
            children: [
              { title: "CDP Private Cloud Overview", href: "/cdppvc/cdppvc" },
              { title: "Demo Architecture", href: "/cdppvc/demo" },
              { title: "Installation Prerequisites", href: "/cdppvc/prerequisites" },
              { title: "Cloudera Manager Deployment", href: "/cdppvc/cm" },
              {
                title: "Base Cluster (Data Lake)",
                children: [
                  { title: "Overview", href: "/cdppvc/base" },
                  { title: "Base Deployment", href: "/cdppvc/basedeploy" },
                  { title: "Base Post-Deployment", href: "/cdppvc/baseconfig" },
                ],
              },
              { title: "ECS Deployment", href: "/cdppvc/ecs" },
              {
                title: "Openshift Deployment",
                children: [
                  { title: "Overview", href: "/cdppvc/ocp" },
                  { title: "Docker Registry in Nexus", href: "/cdppvc/nexus" },
                  { title: "Vault Deployment", href: "/cdppvc/vault" },
                  { title: "CDP Data Services Control Plane on Openshift", href: "/cdppvc/dsocp" },
                ],
              },
              {
                title: "CDP PvC Data Services",
                children: [
                  { title: "Overview", href: "/cdppvc/ds" },
                  { title: "Data Services Console", href: "/cdppvc/dsconsole" },
                  { title: "Cloudera Machine Learning", href: "/cdppvc/cmlds" },
                  { title: "Cloudera Data Warehouse (ECS)", href: "/cdppvc/cdwecs" },
                  { title: "Cloudera Data Warehouse (Openshift)", href: "/cdppvc/cdwocp" },
                  { title: "Cloudera Data Engineering (ECS)", href: "/cdppvc/cdeecs" },
                  { title: "Cloudera Data Engineering (Openshift)", href: "/cdppvc/cdeocp" },
                ],
              },
              {
                title: "CDP PvC ECS: Day-2",
                children: [
                  { title: "Overview", href: "/cdppvc/ecsday2" },
                  { title: "Setup ECS Environment", href: "/cdppvc/ecsenv" },
                  { title: "Deploy LVM Disk", href: "/cdppvc/lvm" },
                  { title: "Add ECS Node", href: "/cdppvc/addecs" },
                  { title: "Deploy Nvidia GPU in ECS", href: "/cdppvc/gpuecs" },
                ],
              },
              {
                title: "CDP PvC Openshift: Day-2",
                children: [
                  { title: "Overview", href: "/cdppvc/ocpday2" },
                  { title: "Deploy CDW Disk in Openshift", href: "/cdppvc/ocpcdwdisk" },
                  { title: "Deploy Nvidia GPU in Openshift", href: "/cdppvc/gpuocp" },
                ],
              },
              { title: "Expand Longhorn Disk Space", href: "/cdppvc/longhornscale" },
              {
                title: "Data Warehousing",
                children: [
                  { title: "Overview", href: "/cdw/cdw" },
                  { title: "Parquet, ORC, Avro and CSV Benchmarking", href: "/cdw/benchmarkfs" },
                  { title: "SNAPPY Compression", href: "/cdw/snappy" },
                  { title: "Auto-scaling in CDW", href: "/cdw/cdwautoscaling" },
                ],
              },
              {
                title: "Longhorn",
                children: [
                  { title: "Overview", href: "/longhorn/longhorn" },
                  { title: "Performance Benchmarking", href: "/longhorn/benchmarking" },
                ],
              },
              {
                title: "Machine Learning",
                children: [
                  { title: "Overview", href: "/cml/cml" },
                  { title: "Threading in Python", href: "/cml/mthread" },
                  { title: "Multiprocessing in Python", href: "/cml/mprocess" },
                  { title: "Image Processing", href: "/cml/imagep" },
                  { title: "Noisy Neighbour", href: "/cml/noisyneighbour" },
                  { title: "Ray", href: "/cml/ray" },
                  { title: "Custom Docker Image", href: "/cml/customimage" },
                  { title: "Pytorch", href: "/cml/pytorch" },
                  { title: "Nvidia GPU Dashboard", href: "/cml/nvdashboard" },
                  { title: "Tensorflow", href: "/cml/tensorflow" },
                  { title: "Dask", href: "/cml/dask" },
                ],
              },
            ],
          },
          {
            title: "CDP 7.3.1",
            href: "/installations/cdp-7.3.1",
          },
        ],
      },
      {
        title: "Upgrades",
        href: "/upgrades/7.1.9-to-7.3.1/index",
      },
      {
        title: "Use Cases",
        href: "/use-cases/medallion-architecture/index",
      },
      {
        title: "Troubleshooting",
        href: "/troubleshooting/index",
      },
    ],
  },
  {
    title: "CDP Public Cloud",
    href: "/cdp-public-cloud",
  },
];
