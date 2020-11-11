import {Selector} from "testcafe";

fixture `My first fixure`
 .page `http://localhost:3000`;

 test("open homepage", async t=>{
     console.log("true");
 });
 test("header item", async t=>{
     const headerItem = Selector("header item");
     if(headerItem){
         console.log("finded");
     }
 });
 test("click create activity button",async t=>{
     const createActivityBtn = Selector("button").withExactText("Create Activity");
     await t 
     .click(createActivityBtn)
     .expect(Selector("form").exists).ok();
 });