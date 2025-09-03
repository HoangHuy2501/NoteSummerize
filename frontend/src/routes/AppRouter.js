import { Component } from "react";
import RouterPath from "./RouterPath";
import { ROLES } from "../middleware/role";
// layout auth
import Layout_Auth from "../layout/Layout_Auth";
// pages auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Verify from "../pages/auth/Verify";
// layout user
import Layout_user from "../layout/Layout_user";
import Dashboard from "../pages/user/dashboard";
import NotesList from "../pages/user/Notes_Pages";
import ViewDetailsNote from '../components/Note_componment/ViewDetails';
const publicRoutes=[
      {
    path: "/auth/login",component: Login,
    layout: Layout_Auth, // thêm layout cho login
  },
  {
    path: "/auth/register",
    component: Register,
    layout: Layout_Auth,
  },
  {
    path: "/verify",
    component: Verify,
  },
]

const protectedRoutes = {
    //Admin quản trị hệ thống
    //User người dùng 
    user: {
        Layout:Layout_user,
        role: [ROLES.USER],
        routes:[
            {path: "/", component: Dashboard},
            {path: RouterPath.dashboard, component: Dashboard},
            {path: RouterPath.note, component: NotesList},
            {path: RouterPath.viewNote, component: ViewDetailsNote},
        ]
    }
};
export {publicRoutes, protectedRoutes}