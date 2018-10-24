<template>
  <v-expansion-panel>
    <v-expansion-panel-content>
      <div slot="header"><h3>Информация об отметке согласующими</h3></div>
      <v-card>
        <v-card-text>
          <v-data-table :headers="headers"  :items="items.APPRDATA" hide-actions>
            <template slot="items" slot-scope="props">
              <tr class="nohover">
                <td class="text-xs-left">{{ props.item.APRST }}</td>
                <td class="text-xs-left">{{ props.item.APRNAME_FULL }}</td>
                <td class="text-xs-left">{{ props.item.CREATED_BY_NAME }}</td>
                <td class="text-xs-left">{{ M(props.item.CREATED_ON + props.item.CREATED_TM, 'YYYYMMDDHHmmSS').format('DD.MM.YYYY HH:mm:SS') }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import moment from 'moment'
export default {
  name: 'approve_users_list',
  props: ['items', 'headers'],
  data () {
    return {
      M: moment
    }
  }
}
</script>

<style scoped>

</style>
