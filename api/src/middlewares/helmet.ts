import helmet from "helmet";


export default helmet({crossOriginEmbedderPolicy:true,
                       crossOriginOpenerPolicy:true,
                       crossOriginResourcePolicy:true,
                       originAgentCluster:true,
                       hidePoweredBy:true})