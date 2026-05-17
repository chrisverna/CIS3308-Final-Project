package com.verna_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import model.stats.*;
import dbUtils.*;
import view.StatsView;

@RestController
public class StatsController {

    @RequestMapping(value = "/stats/getAll", produces = "application/json")
    public String allUsers() {

        StringDataList list = new StringDataList();
        DbConn dbc = new DbConn();
        list = StatsView.getAllStats(dbc);
        dbc.close();

        return Json.toJson(list);
    }

    @RequestMapping(value = "/stats/getById", params = { "statsId" }, produces = "application/json")
    public String getById(@RequestParam("statsId") String statsId) {
        StringData sd = new StringData();

        if (statsId == null) {
            sd.errorMsg = "Error: URL must be stats/getById?statsId=xx where xx is the stats_id of the desired record.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                sd = DbMods.getById(dbc, statsId);
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/stats/delete", params = { "statsId" }, produces = "application/json")
    public String delete(@RequestParam("statsId") String statsId) {
        StringData sd = new StringData();

        DbConn dbc = new DbConn();
        sd.errorMsg = DbMods.delete(dbc, statsId);
        dbc.close();

        return Json.toJson(sd);
    }

    @RequestMapping(value = "/stats/insert", params = { "jsonData" }, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {

        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No stats data was provided in JSON format";
        } else {
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
                errorMsgs.errorMsg = "Could not convert jsonData to model.stats.StringData object: "
                        + jsonInsertData + " - " + e.getMessage();
            }
        }

        return Json.toJson(errorMsgs);
    }

    @RequestMapping(value = "/stats/update", params = { "jsonData" }, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonUpdateData) {

        StringData errorData = new StringData();

        if ((jsonUpdateData == null) || jsonUpdateData.length() == 0) {
            errorData.errorMsg = "Cannot update. No stats data was provided in JSON format";
        } else {
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonUpdateData, StringData.class);

                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();

            } catch (Exception e) {
                errorData.errorMsg = "Unexpected error in controller for 'stats/update'... " + e.getMessage();
            }
        }

        return Json.toJson(errorData);
    }
}