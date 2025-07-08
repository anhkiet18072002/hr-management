import { featureClient } from '../hooks/api/feature.api'

export const PAGE_ROUTES = {
   LOGIN: '/login',
   ADMIN: {
      INDEX: '/admin',
      DASHBOARD: '/admin/dashboard',
      STAFF: {
         INDEX: '/admin/staff',
         ADD: '/admin/staff/add',
         EDIT: '/admin/staff/edit'
      },
      PROJECT: {
         INDEX: '/admin/project',
         ADD: '/admin/project/add',
         EDIT: '/admin/project/edit',
         SHOW_ALL: '/admin/project/show',
         CHART: '/admin/project/chart',
         ASSIGNMENT: {
            INDEX: '/admin/project-assignment',
            ADD: '/admin/project-assignment/add',
            EDIT: '/admin/project-assignment/edit'
         },
         ROLE: {
            INDEX: '/admin/project-role',
            ADD: '/admin/project-role/add',
            EDIT: '/admin/project-role/edit'
         }
      },
      PROJECT_ROLE: {
         INDEX: '/admin/project-role',
         ADD: '/admin/project-role/add',
         EDIT: '/admin/project-role/edit'
      },
      SKILL: {
         INDEX: '/admin/skill',
         ADD: '/admin/skill/add',
         EDIT: '/admin/skill/edit'
      },
      SKILL_LEVEL: {
         INDEX: '/admin/skill-level',
         ADD: '/admin/skill-level/add',
         EDIT: '/admin/skill-level/edit'
      },
      LEAVE: {
         INDEX: '/admin/leave',
         ADD: '/admin/leave/add',
         EDIT: '/admin/leave/edit'
      },
      SKILL_ASSIGNMENT: {
         INDEX: '/admin/skill-assignment',
         ADD: '/admin/skill-assignment/add',
         EDIT: '/admin/skill-assignment/edit',
         CHART: '/admin/skill-assignment/chart'
      },
      JOB_POSITION: {
         INDEX: '/admin/job-position',
         ADD: '/admin/job-position/add',
         EDIT: '/admin/job-position/edit'
      },
      JOB_LEVEL: {
         INDEX: '/admin/job-level',
         ADD: '/admin/job-level/add',
         EDIT: '/admin/job-level/edit'
      },
      ROLE: {
         INDEX: '/admin/role',
         ADD: '/admin/role/add',
         EDIT: '/admin/role/edit'
      },
      FEATURE: {
         INDEX: '/admin/feature',
         ADD: '/admin/feature/add',
         EDIT: '/admin/feature/edit'
      },
      ROLE_ASSIGNMENT: {
         INDEX: '/admin/role-assignment',
         ADD: '/admin/role-assignment/add',
         EDIT: '/admin/role-assignment/edit'
      },
      ACCOUNT_ROLE: {
         INDEX: '/admin/account-role',
         ADD: '/admin/account-role/add',
         EDIT: '/admin/account-role/edit'
      },
      OBJECTIVE: {
         INDEX: '/admin/objective',
         ADD: '/admin/objective/add',
         EDIT: '/admin/objective/edit'
      },
      OBJECTIVE_ASSIGNMENT: {
         INDEX: '/admin/objective_assignment',
         ADD: '/admin/objective_assignment/add',
         EDIT: '/admin/objective_assignment/edit',
         KEY_LIST: '/admin/objective_assignment/keyResultList'
      }
   }
}

export const API_ROUTES = {
   AUTH: {
      LOGIN: 'auth/login'
   },
   PROJECT: {
      INDEX: 'project'
   },
   STAFF: {
      INDEX: 'staff',
      IMPORT: 'staff/import'
   },
   ROLE: {
      INDEX: 'role'
   },
   LEAVE_TYPE: {
      INDEX: 'leave-type'
   },
   LEAVE_ASSIGNMENT: {
      INDEX: 'leave-assignment'
   },
   PROJECT_ASSIGNMENT: {
      INDEX: 'project-assignment'
   },
   SKILL: {
      INDEX: 'skill'
   },
   PROJECT_TYPE: {
      INDEX: 'project-type'
   },
   PROJECT_ROLE: {
      INDEX: 'project-role'
   },
   PROJECT_PRICE_TYPE: {
      INDEX: 'project-price-type'
   },
   PROJECT_BY_STAFF: {
      INDEX: 'project-by-staff'
   },
   JOB_LEVEL: {
      INDEX: 'job-level'
   },
   JOB_POSITION: {
      INDEX: 'job-position'
   },
   FILE_STORAGE: {
      INDEX: 'file-storage',
      UPLOAD: 'file-storage/upload'
   },
   SKILL_ASSIGNMENT: {
      INDEX: 'skill-assignment'
   },
   SKILL_LEVEL: {
      INDEX: 'skill-level'
   },
   DASHBOARD: {
      INDEX: 'dashboard'
   },
   PERMISSION: {
      INDEX: 'permission'
   },
   ACCOUNT: {
      INDEX: 'account'
   },
   ROLE_PERMISSION: {
      INDEX: 'role-permission'
   },
   ACCOUNT_ROLE: {
      INDEX: 'account-role'
   },
   FEATURE: {
      INDEX: 'feature'
   },
   ROLE_FEATURE_PERMISSION: {
      INDEX: 'role-feature-permission'
   },
   OBJECTIVE: {
      INDEX: 'objective'
   },
   KEY_RESULT: {
      INDEX: 'key_result'
   },
   STAFF_KEY_RESULT: {
      INDEX: 'staff_key_result'
   }
}

export const PROTECTED_PAGE_ROUTES: string[] = [PAGE_ROUTES.ADMIN.INDEX]
