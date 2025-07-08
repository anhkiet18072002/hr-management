'use client'
import Button from '@/app/components/button/Button'
import TextField from '@/app/components/input/TextField'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Chart } from 'chart.js'
import { DEFAULT_PAGINATION } from '@/app/constants/pagination.constant'
import { useGetProjectAssignments, useGetProjects } from '@/app/hooks/api'
import { RightCircleOutlined } from '@ant-design/icons'
import { Avatar, Box, Grid, Typography } from '@mui/material'
import {
   DataGrid,
   GridCellParams,
   GridColDef,
   GridPaginationModel
} from '@mui/x-data-grid'
import { commonTheme } from '@/app/configs/theme.config'
import { getFullname } from '@/app/utils/name.util'
import { ContainerStyled } from '@/styles/common.styles'
import { useRouter } from 'next/navigation'
import { PAGE_ROUTES } from '@/app/configs/route.config'
import { formatDate } from '@/app/utils/date.util'
import { Dashboard_Project_Type } from '@/app/types/dashboard.type'
import { useGetDashboardProject } from '@/app/hooks/api/dashboard.hook'
import { ProjectAssignmentType } from '@/app/types/project.type'

const DoughnutChart: React.FC = () => {
   const router = useRouter()
   const chartRef = useRef<HTMLCanvasElement | null>(null)
   const chartInstance = useRef<Chart | null>(null)
   const [projects, setProjects] = useState<Dashboard_Project_Type>()
   const [unassignedStaff, setUnassignedStaff] = useState<number>(0)

   const [projectAssignments, setProjectAssignments] = useState<
      ProjectAssignmentType[]
   >([])

   const [paginationModel, setPaginationModel] =
      useState<GridPaginationModel>(DEFAULT_PAGINATION)

   const [filters, setFilters] = useState({})
   const { data } = useGetProjectAssignments({
      ...filters,
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1
   })

   const { mutate: getreport } = useGetDashboardProject()

   useEffect(() => {
      getreport('project', {
         onSuccess: async (res) => {
            setProjects(res)
         },
         onError: async (err) => {
            // Show toast
         }
      })
   }, [])
   useEffect(() => {
      if (chartRef.current && projects) {
         const ctx = chartRef.current.getContext('2d')
         if (ctx) {
            if (chartInstance.current) {
               chartInstance.current.destroy()
            }

            // Lấy danh sách tên project và thêm nhãn Unassigned Staff
            const labels = [...projects.data.projectName, 'Unassigned Staff']

            // Tính tổng số nhân viên
            const totalStaff =
               projects.data.staffCount.reduce(
                  (sum, count) => sum + Number(count),
                  0
               ) + Number(projects.data.unAssignment)

            const data = [
               ...projects.data.staffCount.map((count) => {
                  return totalStaff > 0
                     ? Number(((Number(count) / totalStaff) * 100).toFixed(2))
                     : 0
               }),
               totalStaff > 0
                  ? Number(
                       (
                          (Number(projects.data.unAssignment) / totalStaff) *
                          100
                       ).toFixed(2)
                    )
                  : 0
            ]

            chartInstance.current = new Chart(ctx, {
               type: 'doughnut',
               data: {
                  labels,
                  datasets: [
                     {
                        data,
                        borderColor: [
                           'rgb(75, 192, 192)',
                           'rgb(255, 205, 86)',
                           'rgb(255, 99, 132)',
                           'rgb(54, 162, 235)',
                           'rgb(153, 102, 255)',
                           'rgb(201, 203, 207)',
                           'rgb(0, 128, 0)',
                           'rgb(255, 165, 0)'
                        ],
                        backgroundColor: [
                           'rgba(75, 192, 192, 0.7)',
                           'rgba(255, 205, 86, 0.7)',
                           'rgba(255, 99, 132, 0.7)',
                           'rgba(54, 162, 235, 0.7)',
                           'rgba(153, 102, 255, 0.7)',
                           'rgba(201, 203, 207, 0.7)',
                           'rgba(0, 128, 0, 0.7)',
                           'rgba(255, 165, 0, 0.7)'
                        ],
                        borderWidth: 1
                     }
                  ]
               },
               options: {
                  responsive: true,

                  layout: {
                     padding: {
                        left: 50, // Tạo khoảng cách bên trái để chart không bị lệch
                        right: 50 // Tạo khoảng cách bên phải để legend không quá sát mép
                     }
                  },
                  title: {
                     display: true,
                     text: 'THE RATIO OF PROJECTS BY THE NUMBER OF STAFF',
                     fontSize: 20,
                     fontColor: '#333',
                     padding: 40
                  },
                  legend: {
                     display: true,
                     position: 'right',
                     labels: {
                        fontSize: 14,
                        padding: 40
                     },
                     // Click ở phần label
                     onClick: (e, legendItem) => {
                        e.stopPropagation()
                        const label = legendItem.text

                        setFilters((preValue) => ({
                           ...preValue,
                           search: label
                        }))
                     }
                  },
                  // Click trực tiếp từ trong chart
                  onClick: (event: any, chartElement: any) => {
                     if (!chartInstance.current) return

                     // Lấy danh sách phần tử được click
                     const elements =
                        chartInstance.current.getElementsAtEvent(event)

                     if (elements.length === 0) return

                     const dataIndex = (elements[0] as any)._index
                     const labels = chartInstance.current.data.labels
                     if (!labels || dataIndex === undefined) return
                     const clickedLabel = labels[dataIndex]

                     setFilters((preValue) => ({
                        ...preValue,
                        search: clickedLabel
                     }))
                  }
               }
            })
         }
      }
      return () => {
         if (chartInstance.current) {
            chartInstance.current.destroy()
         }
      }
   }, [projects, unassignedStaff])

   const handlePaginate = (model: GridPaginationModel) => {
      setPaginationModel(model)
   }
   const columns: GridColDef<ProjectAssignmentType>[] = useMemo<GridColDef[]>(
      () => [
         {
            field: 'info',
            flex: 0.5,
            headerName: 'Staff info',
            renderCell: (params: GridCellParams<ProjectAssignmentType>) => {
               const { row } = params
               return (
                  <Box
                     sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        height: '100%'
                     }}
                  >
                     <Avatar sx={{ fontSize: '14px' }}>
                        {/* {getInitials({ ...row.account })} */}
                     </Avatar>
                     <Box sx={{ flexGrow: 1, marginLeft: '8px' }}>
                        <Typography
                           sx={{
                              color: commonTheme.palette.text.primary,
                              fontSize: '14px',
                              fontWeight: 600
                           }}
                        >
                           {getFullname({
                              firstName: row.staff?.firstName || '',
                              lastName: row.staff?.lastName || '',
                              middleName: row.staff?.middleName
                           })}
                        </Typography>
                        <Typography sx={{ color: '#8c8c8c', fontSize: '14px' }}>
                           {row.staff?.account?.email || ''}
                        </Typography>
                     </Box>
                  </Box>
               )
            }
         },
         {
            field: 'project',
            flex: 0.5,
            headerName: 'Project',
            renderCell: (params: GridCellParams<ProjectAssignmentType>) => {
               const { row } = params
               return (
                  <Box
                     sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        height: '100%'
                     }}
                  >
                     <Typography
                        sx={{
                           color: commonTheme.palette.text.primary,
                           fontSize: '14px'
                        }}
                     >
                        {row.project?.name || ''}
                     </Typography>
                  </Box>
               )
            }
         },
         {
            field: 'Role',
            flex: 0.5,
            headerName: 'Role',
            renderCell: (params: GridCellParams<ProjectAssignmentType>) => {
               const { row } = params

               return (
                  <Box
                     sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        height: '100%'
                     }}
                  >
                     <Typography
                        sx={{
                           color: commonTheme.palette.text.primary,
                           fontSize: '14px'
                        }}
                     >
                        {row.role?.name || ''}
                     </Typography>
                  </Box>
               )
            }
         },
         {
            field: 'startDate',
            minWidth: 140,
            maxWidth: 140,
            headerName: 'Start Date',
            renderCell: (params: GridCellParams<ProjectAssignmentType>) => {
               const { row } = params
               const startDate = row.startDate
                  ? formatDate(row.startDate as string)
                  : ''

               return (
                  <Box
                     sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        height: '100%'
                     }}
                  >
                     <Typography
                        sx={{
                           color: commonTheme.palette.text.primary,
                           fontSize: '14px'
                        }}
                     >
                        {startDate}
                     </Typography>
                  </Box>
               )
            }
         },
         {
            field: 'endDate',
            minWidth: 140,
            maxWidth: 140,
            headerName: 'End Date',
            renderCell: (params: GridCellParams<ProjectAssignmentType>) => {
               const { row } = params
               const endDate = row.endDate
                  ? formatDate(row.endDate as string)
                  : ''

               return (
                  <Box
                     sx={{
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%',
                        height: '100%'
                     }}
                  >
                     <Typography
                        sx={{
                           color: commonTheme.palette.text.primary,
                           fontSize: '14px'
                        }}
                     >
                        {endDate}
                     </Typography>
                  </Box>
               )
            }
         }
      ],
      []
   )
   useEffect(() => {
      setProjectAssignments((data?.data as ProjectAssignmentType[]) || [])
   }, [data])
   return (
      <>
         <Button
            onClick={() => {
               router.push(PAGE_ROUTES.ADMIN.PROJECT.INDEX)
            }}
            size="small"
            startIcon={<RightCircleOutlined />}
            title="Project Assignment"
            sx={{ padding: '0 30px' }}
         />
         <div className="w-[600px] h-[600px] flex mx-auto my-auto">
            <div
               className="border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto shadow-xl pb-2"
               style={{ padding: '30px' }}
            >
               <canvas ref={chartRef}></canvas>
            </div>
         </div>
         <ContainerStyled>
            <Button
               onClick={() => {
                  setFilters((preValue: any) => ({
                     ...preValue,
                     search: ''
                  }))
               }}
               size="small"
               title="Show all"
               sx={{ padding: '0 30px' }}
            />
            <Box sx={{ marginTop: '20px' }}>
               <DataGrid
                  columns={columns}
                  rows={projectAssignments}
                  rowHeight={64}
                  rowCount={data?.meta?.total || 0}
                  paginationModel={{
                     page: data?.meta?.page ? data?.meta?.page - 1 : 0,
                     pageSize: data?.meta?.pageSize || 10
                  }}
                  onPaginationModelChange={handlePaginate}
               />
            </Box>
         </ContainerStyled>
      </>
   )
}
export default DoughnutChart
