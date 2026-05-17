package com.verna_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import dbUtils.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import model.webUser.*;
import view.WebUserView;

@RestController
public class WebUserController {

    @RequestMapping(value = "/webUser/getAll", produces = "application/json")
    public String allUsers() {

        StringDataList list = new StringDataList();
        DbConn dbc = new DbConn();
        list = WebUserView.getAllUsers(dbc);
        dbc.close();

        return Json.toJson(list);
    }

    @RequestMapping(value = "/webUser/getById", params = { "userId" }, produces = "application/json")
    public String getById(@RequestParam("userId") String userId) {
        StringData sd = new StringData();

        if (userId == null) {
            sd.errorMsg = "Error: URL must be webUser/getById?userId=xx where xx is the web_user_id of the desired record.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                sd = DbMods.getById(dbc, userId);
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/delete", params = { "userId" }, produces = "application/json")
    public String delete(@RequestParam("userId") String userId) {
        StringData sd = new StringData();

        DbConn dbc = new DbConn();
        sd.errorMsg = DbMods.delete(dbc, userId);
        dbc.close();

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/logon", params = { "email", "password" }, produces = "application/json")
    public String logonController(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            HttpServletRequest request) {

        HttpSession session = request.getSession();
        StringData sd = new StringData();
        DbConn dbc = new DbConn();

        if (dbc.getErr().length() > 0) {
            sd.errorMsg = "Database currently unavailable. " + dbc.getErr();
            dbc.close();
            return Json.toJson(sd);
        }

        sd = DbMods.findByCredentials(dbc, email, password);
        dbc.close();

        try {
            if (sd.errorMsg.length() == 0) {
                session.setAttribute("loggedOnUser", sd);
            } else {
                session.invalidate();
            }
        } catch (Exception e) {
            sd.errorMsg += " Session error: " + e.getMessage();
        }

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/getProfile", produces = "application/json")
    public String getProfileController(HttpServletRequest request) {

        HttpSession session = request.getSession();
        StringData sd = new StringData();

        try {
            if (session.getAttribute("loggedOnUser") != null) {
                sd = (StringData) session.getAttribute("loggedOnUser");
            } else {
                sd.errorMsg = "Cannot show profile -- no user logged in.";
            }
        } catch (Exception e) {
            sd.errorMsg = "Error reading session. " + e.getMessage();
        }

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/logoff", produces = "application/json")
    public String logoffController(HttpServletRequest request) {

        HttpSession session = request.getSession();
        StringData sd = new StringData();

        try {
            session.invalidate();
            sd.errorMsg = "User is now logged off.";
        } catch (Exception e) {
            sd.errorMsg = "Error invalidating session. " + e.getMessage();
        }

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/insert", params = { "jsonData" }, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No user data was provided in JSON format";
        } else {
            System.out.println("user data for insert (JSON): " + jsonInsertData);
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);

                DbConn dbc = new DbConn();
                errorMsgs.errorMsg = dbc.getErr();

                if (errorMsgs.errorMsg.length() == 0) {
                    errorMsgs = DbMods.insert(insertData, dbc);
                }
                dbc.close();

            } catch (Exception e) {
                errorMsgs.errorMsg = "Could not convert jsonData to model.webUser.StringData object: "
                        + jsonInsertData + " - " + e.getMessage();
            }
        }

        return Json.toJson(errorMsgs);
    }

    @RequestMapping(value = "/webUser/update", params = { "jsonData" }, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonUpdateData) {

        StringData errorData = new StringData();

        if ((jsonUpdateData == null) || jsonUpdateData.length() == 0) {
            errorData.errorMsg = "Cannot update. No user data was provided in JSON format";
        } else {
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonUpdateData, StringData.class);

                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();

            } catch (Exception e) {
                errorData.errorMsg = "Unexpected error in controller for 'webUser/update'... " + e.getMessage();
            }
        }

        return Json.toJson(errorData);
    }
}