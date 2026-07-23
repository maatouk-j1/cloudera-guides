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
        href: "/installations",
        children: [
          {
            title: "CDP 7.1.7",
            href: "/installations/cdp-7-1-7",
            children: [
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
                href: "/installations/cdp-7-1-7/cdppvc/base",
                children: [
                  { title: "Base Deployment", href: "/installations/cdp-7-1-7/cdppvc/basedeploy" },
                  { title: "Base Post-Deployment", href: "/installations/cdp-7-1-7/cdppvc/baseconfig" },
                ],
              },
              { title: "ECS Deployment", href: "/installations/cdp-7-1-7/cdppvc/ecs" },
              {
                title: "Openshift Deployment",
                href: "/installations/cdp-7-1-7/cdppvc/ocp",
                children: [
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
                href: "/installations/cdp-7-1-7/cdppvc/ds",
                children: [
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
                href: "/installations/cdp-7-1-7/cdppvc/ecsday2",
                children: [
                  { title: "Setup ECS Environment", href: "/installations/cdp-7-1-7/cdppvc/ecsenv" },
                  { title: "Deploy LVM Disk", href: "/installations/cdp-7-1-7/cdppvc/lvm" },
                  { title: "Add ECS Node", href: "/installations/cdp-7-1-7/cdppvc/addecs" },
                  { title: "Deploy Nvidia GPU in ECS", href: "/installations/cdp-7-1-7/cdppvc/gpuecs" },
                ],
              },
              {
                title: "CDP PvC Openshift: Day-2",
                href: "/installations/cdp-7-1-7/cdppvc/ocpday2",
                children: [
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
                href: "/installations/cdp-7-1-7/cdw/cdw",
                children: [
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
                href: "/installations/cdp-7-1-7/longhorn/longhorn",
                children: [
                  {
                    title: "Performance Benchmarking",
                    href: "/installations/cdp-7-1-7/longhorn/benchmarking",
                  },
                ],
              },
              {
                title: "Machine Learning",
                href: "/installations/cdp-7-1-7/cml/cml",
                children: [
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
          {
            title: "CDP 7.3.2",
            href: "/installations/cdp-7-3-2",
            children: [
              { title: "VM Creation", href: "/installations/cdp-7-3-2/vm" },
              { title: "Solution Summary", href: "/installations/cdp-7-3-2/summary" },
              {
                title: "Post OS Installation - Preliminary Work",
                href: "/installations/cdp-7-3-2/post-os-work",
              },
              {
                title: "Install CDP Private Cloud",
                href: "/installations/cdp-7-3-2/cdppvc",
                children: [
                  {
                    title: "Prerequisites Overview",
                    href: "/installations/cdp-7-3-2/cdppvc/prerequisites",
                  },
                  {
                    title: "Setup Repositories and Parcels",
                    href: "/installations/cdp-7-3-2/cdppvc/repos-and-parcels",
                  },
                  {
                    title: "Setup Cloudera Manager Server",
                    href: "/installations/cdp-7-3-2/cdppvc/cm",
                    children: [
                      {
                        title: "Setup Database for Cloudera Manager",
                        href: "/installations/cdp-7-3-2/cdppvc/cm/database",
                      },
                      {
                        title: "Install Cloudera Manager Server",
                        href: "/installations/cdp-7-3-2/cdppvc/cm/server",
                      },
                      { title: "Enable Auto-TLS", href: "/installations/cdp-7-3-2/cdppvc/cm/auto-tls" },
                      { title: "Enable Kerberos", href: "/installations/cdp-7-3-2/cdppvc/cm/kerberos" },
                      {
                        title: "Setup Cloudera Management Services",
                        href: "/installations/cdp-7-3-2/cdppvc/cm/mgmt-services",
                      },
                      {
                        title: "Configure CM for external authentication using LDAP",
                        href: "/installations/cdp-7-3-2/cdppvc/cm/ldap-auth",
                      },
                    ],
                  },
                  {
                    title: "Setup CDP PvC Base Cluster",
                    href: "/installations/cdp-7-3-2/cdppvc/base",
                    children: [
                      {
                        title: "Install CDP PvC Base using the CM Web UI",
                        href: "/installations/cdp-7-3-2/cdppvc/base/installation",
                      },
                      {
                        title: "Data Lake Creation",
                        href: "/installations/cdp-7-3-2/cdppvc/base/data-lake",
                      },
                      {
                        title: "Additional Requirements and Details",
                        href: "/installations/cdp-7-3-2/cdppvc/base/additional-requirements",
                      },
                      {
                        title: "Configure services with SSL/TLS-enabled Metadata Database",
                        href: "/installations/cdp-7-3-2/cdppvc/base/services-metadata-db-tls",
                      },
                      {
                        title: "Scale the Cluster (Optional)",
                        href: "/installations/cdp-7-3-2/cdppvc/base/scale-cluster",
                      },
                      {
                        title: "Enable High Availability (Optional)",
                        href: "/installations/cdp-7-3-2/cdppvc/base/high-availability",
                      },
                      {
                        title: "Configure Services authentication for LDAP (Optional)",
                        href: "/installations/cdp-7-3-2/cdppvc/base/ldap-auth",
                      },
                      {
                        title: "Optimize Log Collection",
                        href: "/installations/cdp-7-3-2/cdppvc/base/optimize-log-collection",
                      },
                    ],
                  },
                ],
              },
              {
                title: "CDP Data Services Installation (ECS)",
                href: "/installations/cdp-7-3-2/ds",
                children: [
                  {
                    title: "Embedded Container Service (ECS) Requirements",
                    href: "/installations/cdp-7-3-2/ds/ecs-requirements",
                  },
                  { title: "Checklist", href: "/installations/cdp-7-3-2/ds/checklist" },
                  {
                    title: "Install CDP Data Services using ECS",
                    href: "/installations/cdp-7-3-2/ds/ecs",
                    children: [
                      {
                        title: "Install ECS Cluster",
                        href: "/installations/cdp-7-3-2/ds/ecs/installation",
                      },
                      {
                        title: "Additional Steps for ECS Cluster Setup",
                        href: "/installations/cdp-7-3-2/ds/ecs/additional-steps",
                      },
                      {
                        title: "Dedicating ECS Nodes for Specific Workloads (Optional)",
                        href: "/installations/cdp-7-3-2/ds/ecs/specific-workloads",
                      },
                    ],
                  },
                ],
              },
              {
                title: "Accessing Cloudera",
                href: "/installations/cdp-7-3-2/accessing-cloudera",
              },
              { title: "Cloudera AI (CAI)", href: "/installations/cdp-7-3-2/cai" },
              { title: "Cloudera Data Warehouse (CDW)", href: "/installations/cdp-7-3-2/cdw" },
              { title: "Cloudera Data Engineering (CDE)", href: "/installations/cdp-7-3-2/cde" },
              {
                title: "Appendix",
                href: "/installations/cdp-7-3-2/appendix",
                children: [
                  {
                    title: "References Used in Guide",
                    href: "/installations/cdp-7-3-2/appendix/references",
                  },
                  {
                    title: "Glossary of Terms",
                    href: "/installations/cdp-7-3-2/appendix/glossary-terms",
                  },
                  {
                    title: "Glossary of Acronyms",
                    href: "/installations/cdp-7-3-2/appendix/glossary-acronyms",
                  },
                  { title: "FreeIPA Reference", href: "/installations/cdp-7-3-2/appendix/freeipa" },
                ],
              },
              { title: "Cluster Validation", href: "/installations/cdp-7-3-2/validation" },
              { title: "Cluster Cleanup", href: "/installations/cdp-7-3-2/cleanup" },
              { title: "Error Handling", href: "/installations/cdp-7-3-2/error-handling" },
              {
                title: "Kubernetes Command Reference",
                href: "/installations/cdp-7-3-2/kubernetes-commands",
              },
              { title: "Acknowledgements", href: "/installations/cdp-7-3-2/acknowledgements" },
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
