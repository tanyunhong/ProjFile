<template>
    <div>
        <ul>
            <li v-for="item of componentArr">
                <router-link :to="item.routeUrl">{{item.componentName}}</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
import index from './index'
export default {
    data(){
        return {
            componentArr: index.data
        }
    }
}   
</script>