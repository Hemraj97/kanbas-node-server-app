import Database from "../Database/index.js";

export default function AssignmentRoutes(app){

    app.get("/api/courses/:courseId/assignments", (req,res)=>{
        const {courseId}= req.params;
        const assignments=Database.assignments.filter((a)=>a.course===courseId);
        res.send(assignments);
    });

    app.post("/api/courses/:courseId/assignments",(req,res)=>{
        const {courseId}=req.params;
        
        const assignment={...req.body, 
            course:courseId,
            _id: new Date().getTime().toString()};
        Database.assignments.push(assignment);
        res.send(assignment);
    });

    app.put("/api/assignments/:assignId", (req,res)=>{
        const {assignId}=req.params;
        const assignIndex=Database.assignments.findIndex((a)=>a._id===assignId);
        Database.assignments[assignIndex]={
            ...Database.assignments[assignIndex],
            ...req.body
        };
        res.sendStatus(204);
    });

    

    app.delete("/api/assignments/:assignId", (req,res)=>{
        const {assignId}=req.params;
        Database.assignments=Database.assignments.filter((a)=>a._id!==assignId);
        console.log(Database.assignments);
        res.sendStatus(204);
    });
}