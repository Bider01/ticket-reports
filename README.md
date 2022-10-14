[![pages-build-deployment](https://github.com/Bider01/ticket-reports/actions/workflows/pages/pages-build-deployment/badge.svg?branch=gh-pages)](https://github.com/Bider01/ticket-reports/actions/workflows/pages/pages-build-deployment)

# A következő kódrészletek hozzáadása szükséges a FooEvents-hez

## fooevents/classes/apihelper.php

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


      function updateCoupon($ticketID, $add) {
  
      global $woocommerce;
      global $wpdb;
  
      $table_name = $wpdb->prefix . 'wc_order_coupon_lookup';
      $postmeta_table_name = $wpdb->prefix . 'postmeta';
    $order_items_table_name = $wpdb->prefix . 'woocommerce_order_items';
  
      
    
    if($add == 1) {
      $wpdb->get_results("INSERT INTO ".$table_name." (`order_id`, `coupon_id`, `date_created`, `discount_amount`) VALUES ((SELECT `meta_value` FROM ".$postmeta_table_name." WHERE `meta_key` = 'WooCommerceEventsOrderID' AND `post_id` = (SELECT `post_id` FROM ".$postmeta_table_name." WHERE `meta_key` = 'WooCommerceEventsTicketID' AND `meta_value` =  ".$ticketID.")), '11033', Now(), '0')");
      $result = $wpdb->get_results("INSERT INTO ".$order_items_table_name." (`order_item_id`, `order_item_name`, `order_item_type`, `order_id`) VALUES (NULL, 'ceremony', 'coupon',(SELECT `meta_value` FROM ".$postmeta_table_name." WHERE `meta_key` = 'WooCommerceEventsOrderID' AND `post_id` = (SELECT `post_id` FROM ".$postmeta_table_name." WHERE `meta_key` = 'WooCommerceEventsTicketID' AND `meta_value` =  ".$ticketID.")))");
    } else {
      $wpdb->get_results("DELETE FROM ".$table_name." WHERE `coupon_id` = '11033' AND `order_id` = ((SELECT `meta_value` FROM ".$postmeta_table_name." WHERE `meta_key` = 'WooCommerceEventsOrderID' AND `post_id` = (SELECT `post_id` FROM ".$postmeta_table_name." WHERE `meta_key` = 'WooCommerceEventsTicketID' AND `meta_value` =  ".$ticketID.")))");
      $result = $wpdb->get_results("DELETE FROM ".$order_items_table_name." WHERE `order_item_type` = 'coupon' AND `order_id` = (SELECT `meta_value` FROM ".$postmeta_table_name." WHERE `meta_key` = 'WooCommerceEventsOrderID' AND `post_id` = (SELECT `post_id` FROM ".$postmeta_table_name." WHERE `meta_key` = 'WooCommerceEventsTicketID' AND `meta_value` =  ".$ticketID."))");
    }
    
     return "$result";
  }


    



## fooevents/classes/restapihelper.php

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

    /**
     * Update ticket coupon
     */
    public function fooevents_callback_update_coupon(WP_REST_Request $request) {
        $authorize_result = $this->fooevents_is_authorized_user($request->get_headers());

        if ( $authorize_result && is_object($authorize_result) && is_a($authorize_result, 'WP_User') ) {
            error_reporting(0);
            ini_set('display_errors', 0);

            $ticketID        = $request->get_param("id");
            $add             = $request->get_param("add");

			if ( !empty($ticketID) ) {
                $output['message'] = updateCoupon($ticketID, $add);
            } else {
                $output['message'] = 'All fields are required.';
            }

            echo json_encode($output);
        } else {
            echo json_encode($authorize_result);
        }

        exit();
    }

### Kódrészlet amit le ki kell egészíteni:

    $rest_api_endpoints = array('login_status',
            'get_all_data',
            'get_list_of_events',
            'get_tickets_in_event',
            'get_updated_tickets_in_event',
            'get_single_ticket',
            
            'update_ticket_status',
            'update_ticket_status_m',
            'update_ticket_status_multiday',

            'get_check_in',
			
			      'update_coupon'
    );

### Az elejére el kell helyezni a cross origin engedélyezéséhez:

    <? if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] == 'https://bider01.github.io') {
        header("Access-Control-Allow-Origin: https://bider01.github.io"); 
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
          if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
          if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
          exit(0);
        }   
        } ?>

## Parancs a GitHub Page deploy előkészítéséhez:

    ng build --output-path docs --base-href /ticket-reports/

##A fooevents.phphoz hozzá kell adni

		//RESTAPIHelperOwn
        require_once($this->Config->classPath.'ownrestapihelper.php');
        $this->RESTAPIHelperOwn = new FooEvents_REST_API_Helper_Own();
