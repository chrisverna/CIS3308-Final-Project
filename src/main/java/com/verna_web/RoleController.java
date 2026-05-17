package com.verna_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import model.role.*;
import dbUtils.*;
import view.RoleView;

@RestController
public class RoleController {

    @RequestMapping(value = "/role/getAll", produces = "application/json")
    public String allRoles() {

        StringDataList list = new StringDataList();
        DbConn dbc = new DbConn();
        list = RoleView.getAllRoles(dbc);
        dbc.close();

        return Json.toJson(list);
    }
}