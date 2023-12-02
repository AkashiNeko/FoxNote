import { navbar } from "vuepress-theme-hope";

export default navbar([
    "/",
    {
        text: "文章",
        icon: "pen-to-square",
        prefix: "/posts/",
        children: [
            {
                text: "5种IO模型",
                link: "5-io-models"
            },
        ],
    },
]);
