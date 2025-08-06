import { generateResult } from "../services/ai.service";


export const getResult=async (req,res) =>{
    try{
        const {promt} =req.body;
        const result = await generateResult(promt);
        res.send(result);



    }catch(error){
        res.status(500).send({message : error.message})''
    }
}