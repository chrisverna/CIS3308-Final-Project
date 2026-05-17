package model.role;

import java.util.ArrayList;

public class StringDataList {

    public String dbError = "";
    public ArrayList<StringData> roleList = new ArrayList<StringData>();

    public StringDataList() {
    }

    public void add(StringData sd) {
        this.roleList.add(sd);
    }
}