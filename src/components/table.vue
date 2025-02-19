<template>
 <div class="table_wrapper">
        <table class="table-striped">
            <thead>
                <tr>
                    <th v-for="col in cols" :key="col.title">
                        <div v-text="col.title"></div>
                       <!-- <input type="text" v-model="col.filter" /> -->
                    </th>
                    <th v-if="!isNull(options)">פעולות</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in rowsComp" :key="item.id">
                    <td v-for="col in cols" :key="col.title">
                        <router-link v-if="!isNull(col.link)" :to="col.link(item)" v-text="get_value(item, col)"></router-link>
                        <span v-else v-html="get_value(item, col)"></span> 
                    </td>
                    <td v-if="!isNull(options)">
                        <div class="options">
                            <a :class="'action ' + (!isNull(action.class) ? action.class : '')" v-for="action in options(item)" :key="action.title" v-html="action.title" @click="doAction(action,item)"></a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>

export default {
    props: ["cols", "rows", "options"],
  data(){
      return {
      }
  },
  computed:{
    rowsComp(){
        var ret = [];

        for (let i in this.rows)
        {
            var row = this.rows[i];

            var ret_ins = true;

            for (let z in this.cols)
            {
                var col = this.cols[z];
                if (!this.isNull(col.filter) && col.filter != '' )
                {
                    ret_ins =  (this.get_value(row,col).search(new RegExp(col.filter, "i")) != -1);
                    if (ret_ins === false) break;
                   // alert(row);
                }
            }

            if (ret_ins) ret.push(row);
        }

        return ret;
    }
  },
  methods:{
    doAction(action,item){
        if (!this.isNull(action.confirm)) 
        {
            if (!confirm(action.confirm)) return false;
        }

        action.onClick(item);
    },
    get_value(item,col){
        if (!this.isNull(col.func)) return col.func(item);
        else 
        {
        let val = item[col.field];
        switch(col.type)
        {
            case 'date': { val = this.moment(val).format('DD.MM.YY'); break; }
            case 'datetime': { let d = Date.parse(val); val = d.toString('DD.MM.YY h:mm'); break; }
            case 'number': { val = this.format_number(val); break; }
            case 'nis': { val = '₪' + this.format_number(val); break; }
        }
        return val;
        }
    }
  }
}
</script>
<style lang="scss" scoped>

.table_wrapper{ position: relative;
  @media (min-width: 600px) { max-height: calc(100vh - 220px); overflow-y: auto; }
  @media (max-width: 600px) { overflow-x: auto; }
}

table { border-collapse: separate !important; border-spacing: 0px; 
    & { width:100%; }
    th {    padding:0.75rem; background: #f5f6f8;  position: sticky; top: 0; z-index: 8;
        &, * { font-family: var(--font2) !important; }
        input { width:calc(100% - 5px); max-width: 100px; border:none; border-bottom:1px solid #ddd; padding-left:8px;  }
    }

    td { /*border-top: 1px solid #dee2e6;*/}

    tr{
        &:nth-child(1){border-bottom: none;;border-top: none;margin-bottom: 10px;} 
        &:nth-child(1) th{padding-bottom: 15px;}
        &{border-bottom: 1px solid #e7e7e7;border-top: 1px solid #e7e7e7;} 
        td{padding: 15px 5px; padding-inline-start: 0.75rem; color: #212f56;font-size: 15px; min-height: 50px;}

        &:hover { background: #fbfbfb;}
    }

    .options { display: flex; gap:6px; /*flex-wrap: wrap;*/ align-items: center;
        .action { box-sizing: content-box; display: inline-flex; gap: 5px; align-items: center; height: 26px; line-height: 26px; overflow: hidden; border: 1px solid #E6EBEB; border-radius: 8px; text-align: center; padding: 0 8px; font-weight: bold; color: #333; vertical-align: middle; font-size: 12px; background-color: #fff; white-space: nowrap;
    
            &.red { background: #b81f1f; color: #fff;}
            &.green { background: #1fb840; color: #fff;}
        }
    }

}
</style>