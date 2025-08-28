import { Component } from "react";
import RouterPath from "./RouterPath";
// layout auth
import Layout_Auth from "./layout/Layout_Auth";
// pages auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
const publicRoutes=[
    {path: RouterPath.login, component: Login},
    {path: RouterPath.register, component: Register},
    {path: RouterPath.verify, component: Verify},
]

export {publicRoutes}