import { PAGE_ROUTES } from '@/app/configs/route.config'
import {
   NavigationGroupType,
   NavigationType
} from '@/app/types/navigation.type'

export const LEFT_NAVIGATION: NavigationType[] | NavigationGroupType[] = [
   {
      kind: 'header',
      title: 'Dashboard'
   },
   {
      segment: 'dashboard',
      title: 'Dashboard',
      route: PAGE_ROUTES.ADMIN.DASHBOARD
   },
   {
      kind: 'header',
      title: 'Management'
   },
   {
      segment: 'leave',
      title: 'Leave',
      route: PAGE_ROUTES.ADMIN.LEAVE.INDEX,
      children: [
         {
            segment: 'leave.add',
            title: 'Add a new Leave',
            route: PAGE_ROUTES.ADMIN.LEAVE.ADD
         },
         {
            segment: 'leave.add',
            title: 'Edit a Leave',
            route: PAGE_ROUTES.ADMIN.LEAVE.EDIT
         }
      ]
   },
   {
      segment: 'project',
      title: 'Project',
      route: PAGE_ROUTES.ADMIN.PROJECT.INDEX,
      children: [
         {
            segment: 'project.add',
            title: 'Add a new Project',
            route: PAGE_ROUTES.ADMIN.PROJECT.ADD
         },
         {
            segment: 'project.add',
            title: 'Edit a Project',
            route: PAGE_ROUTES.ADMIN.PROJECT.EDIT
         }
      ]
   },
   {
      segment: 'staff',
      title: 'Staff',
      route: PAGE_ROUTES.ADMIN.STAFF.INDEX,
      children: [
         {
            segment: 'staff.add',
            title: 'Add a new Staff',
            route: PAGE_ROUTES.ADMIN.STAFF.ADD
         },
         {
            segment: 'staff.add',
            title: 'Edit a Staff',
            route: PAGE_ROUTES.ADMIN.STAFF.EDIT
         }
      ]
   },
   {
      segment: 'objective',
      title: 'Objective',
      route: PAGE_ROUTES.ADMIN.OBJECTIVE.INDEX,
      children: [
         {
            segment: 'objective.add',
            title: 'Add a new Objective',
            route: PAGE_ROUTES.ADMIN.OBJECTIVE.ADD
         },
         {
            segment: 'objective.add',
            title: 'Edit a Objective',
            route: PAGE_ROUTES.ADMIN.OBJECTIVE.EDIT
         }
      ]
   },

   {
      kind: 'header',
      title: 'Configuration'
   },
   {
      segment: 'objective_assignment',
      title: 'Objective Assignment',
      route: PAGE_ROUTES.ADMIN.OBJECTIVE_ASSIGNMENT.INDEX,
      children: [
         {
            segment: 'objective_assignment.add',
            title: 'Add a new Objective Assignment',
            route: PAGE_ROUTES.ADMIN.OBJECTIVE_ASSIGNMENT.ADD
         },
         {
            segment: 'objective.add',
            title: 'Edit a Objective Assignment',
            route: PAGE_ROUTES.ADMIN.OBJECTIVE_ASSIGNMENT.EDIT
         }
      ]
   },
   {
      segment: 'job-level',
      title: 'Job Level',
      route: PAGE_ROUTES.ADMIN.JOB_LEVEL.INDEX,
      children: [
         {
            segment: 'job-position.add',
            title: 'Add a new Job Level',
            route: PAGE_ROUTES.ADMIN.JOB_LEVEL.ADD
         },
         {
            segment: 'job-position.edit',
            title: 'Edit a Job Level',
            route: PAGE_ROUTES.ADMIN.JOB_LEVEL.EDIT
         }
      ]
   },
   {
      segment: 'job-position',
      title: 'Job Position',
      route: PAGE_ROUTES.ADMIN.JOB_POSITION.INDEX,
      children: [
         {
            segment: 'job-position.add',
            title: 'Add a new Job Position',
            route: PAGE_ROUTES.ADMIN.JOB_POSITION.ADD
         },
         {
            segment: 'job-position.edit',
            title: 'Edit a Job Position',
            route: PAGE_ROUTES.ADMIN.JOB_POSITION.EDIT
         }
      ]
   },
   {
      segment: 'project-role',
      title: 'Project Role',
      route: PAGE_ROUTES.ADMIN.PROJECT.ROLE.INDEX,
      children: [
         {
            segment: 'project-role.add',
            title: 'Add a new Project role',
            route: PAGE_ROUTES.ADMIN.PROJECT.ROLE.ADD
         },
         {
            segment: 'project-role.edit',
            title: 'Edit a Project role',
            route: PAGE_ROUTES.ADMIN.PROJECT.ROLE.EDIT
         }
      ]
   },
   {
      segment: 'role',
      title: 'Role',
      route: PAGE_ROUTES.ADMIN.ROLE.INDEX,
      children: [
         {
            segment: 'role.add',
            title: 'Add a new Role',
            route: PAGE_ROUTES.ADMIN.ROLE.ADD
         },
         {
            segment: 'role.add',
            title: 'Edit a Role',
            route: PAGE_ROUTES.ADMIN.ROLE.EDIT
         }
      ]
   },
   {
      segment: 'account-role',
      title: 'Account-Role',
      route: PAGE_ROUTES.ADMIN.ACCOUNT_ROLE.INDEX,
      children: [
         {
            segment: 'account-role.add',
            title: 'Add a new Account-Role',
            route: PAGE_ROUTES.ADMIN.ACCOUNT_ROLE.ADD
         },
         {
            segment: 'account-role.add',
            title: 'Edit a Account-Role',
            route: PAGE_ROUTES.ADMIN.ACCOUNT_ROLE.EDIT
         }
      ]
   },
   {
      segment: 'feature',
      title: 'Feature',
      route: PAGE_ROUTES.ADMIN.FEATURE.INDEX,
      children: [
         {
            segment: 'role.add',
            title: 'Add a new Role',
            route: PAGE_ROUTES.ADMIN.ROLE.ADD
         },
         {
            segment: 'role.add',
            title: 'Edit a Role',
            route: PAGE_ROUTES.ADMIN.ROLE.EDIT
         }
      ]
   },
   {
      segment: 'skill',
      title: 'Skill',
      route: PAGE_ROUTES.ADMIN.SKILL.INDEX,
      children: [
         {
            segment: 'skill.add',
            title: 'Add a new Skill',
            route: PAGE_ROUTES.ADMIN.SKILL.ADD
         },
         {
            segment: 'skill.add',
            title: 'Edit a Skill',
            route: PAGE_ROUTES.ADMIN.SKILL.EDIT
         }
      ]
   },
   {
      segment: 'skill-level',
      title: 'Skill Level',
      route: PAGE_ROUTES.ADMIN.SKILL_LEVEL.INDEX,
      children: [
         {
            segment: 'skill-level.add',
            title: 'Add a new Skill',
            route: PAGE_ROUTES.ADMIN.SKILL_LEVEL.ADD
         },
         {
            segment: 'skill-level.add',
            title: 'Edit a Skill',
            route: PAGE_ROUTES.ADMIN.SKILL_LEVEL.EDIT
         }
      ]
   }
]
