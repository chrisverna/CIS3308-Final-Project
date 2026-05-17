package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dbUtils.*;
import model.role.StringData;
import model.role.StringDataList;

public class RoleView {

    public static StringDataList getAllRoles(DbConn dbc) {

        StringDataList sdl = new StringDataList();

        if (dbc.getErr().length() > 0) {
            sdl.dbError = dbc.getErr();
            return sdl;
        }

        try {
            String sql = "SELECT user_role_id, user_role_type " +
                         "FROM user_role " +
                         "ORDER BY user_role_type";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while (results.next()) {
                StringData sd = new StringData();
                sd.userRoleId = Format.fmtInteger(results.getObject("user_role_id"));
                sd.userRoleType = Format.fmtString(results.getObject("user_role_type"));
                sdl.add(sd);
            }

            results.close();
            stmt.close();

        } catch (Exception e) {
            sdl.dbError = "Exception in RoleView.getAllRoles(): " + e.getMessage();
        }

        return sdl;
    }
}