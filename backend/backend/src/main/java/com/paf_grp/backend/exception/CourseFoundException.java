package com.paf_grp.backend.exception;

public class CourseFoundException extends  RuntimeException{
    public CourseFoundException (Long id) {
        super("could not find id" + id);
    }

    public CourseFoundException(String message){
        super(message);
    }

}
