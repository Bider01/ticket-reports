#A következő kódrészletek hozzáadása szükséges a FooEvents-hez

##fooevents/classes/apihelper.php

    function getEventUpdatedTicketsWithStatus($eventID, $since) {
    
        global $woocommerce;
        global $wpdb;
    
        $table_name = $wpdb->prefix . 'fooevents_check_in';
        $postmeta_table_name = $wpdb->prefix . 'postmeta';
        
        $ticketsArray = array();
        $ticketStatusOptions = array();
        
        $eventID = sanitize_text_field($eventID);
        $since = sanitize_text_field($since);
    
        $tickets = $wpdb->get_results("
            SELECT ".$table_name.".*, p1.meta_value AS ticketId, p2.meta_value AS name, p3.meta_value AS variation FROM ".$table_name."
            LEFT JOIN ".$postmeta_table_name." AS p1 ON
                ".$table_name.".tid = p1.post_id AND
                p1.meta_key = 'WooCommerceEventsTicketID'
        LEFT JOIN ".$postmeta_table_name." AS p2 ON
                ".$table_name.".tid = p2.post_id AND
                p2.meta_key = 'fooevents_custom_option_1'
        LEFT JOIN ".$postmeta_table_name." AS p3 ON
                ".$table_name.".tid = p3.post_id AND
                p3.meta_key = 'WooCommerceEventsVariationID'
            WHERE
                eid = ".$eventID." AND
                checkin >= ".$since."
        ORDER BY ".$table_name.".`updated` DESC
        ");
    
        foreach ( $tickets as $ticket ) {
    
            $ticketsArray[] = array(
                'wooCommerceEventsTicketID' => $ticket->ticketId,
                'status' => $ticket->status,
          'time' => (int)$ticket->checkin,
          'name' => $ticket->name,
          'variation' => (int)$ticket->variation,
            );
    
        }
    
        return $ticketsArray;
    
    }

##fooevents/classes/restapihelper.php

    public function fooevents_callback_get_check_in(WP_REST_Request $request) {
        $authorize_result = $this->fooevents_is_authorized_user($request->get_headers());

        if ( $authorize_result && is_object($authorize_result) && is_a($authorize_result, 'WP_User') ) {
            error_reporting(0);
            ini_set('display_errors', 0);

            set_time_limit(0);
            $memory_limit = ini_get('memory_limit');
            ini_set('memory_limit', '-1');

            $eventID = $request->get_param("param2");
            $since = $request->get_param("param3");

            echo json_encode(getEventUpdatedTicketsWithStatus($eventID, $since));

            ini_set('memory_limit', $memory_limit);
        } else {
            echo json_encode($authorize_result);
        }

        exit();
    }

Kódrészlet amit le ki kell egészíteni:

    $rest_api_endpoints = array('login_status',
            'get_all_data',
            'get_list_of_events',
            'get_tickets_in_event',
            'get_updated_tickets_in_event',
            'get_single_ticket',
            
            'update_ticket_status',
            'update_ticket_status_m',
            'update_ticket_status_multiday',

            'get_check_in'
    );
