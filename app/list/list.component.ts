import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Activity } from "../shared/activity/activity.model";
import { ActivityService } from "../shared/activity/activity.service";
import { TextField } from "tns-core-modules/ui/text-field";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { View } from "tns-core-modules/ui/core/view";

@Component({
    selector: "gr-list",
    moduleId: module.id,
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.css"],
    providers: [ActivityService]
})
export class ListComponent implements OnInit {
    activityList: Array<Activity> = [];
    activity = "";
    isLoading = false;
    listLoaded = false;

    @ViewChild("activityTextField", { static: false }) activityTextField: ElementRef;

    constructor(private activityService: ActivityService) { }

    ngOnInit() {
        this.isLoading = true;
        this.activityService.load()
            .subscribe((loadedActivities: []) => {
                loadedActivities.forEach((activityObject) => {
                    this.activityList.unshift(activityObject);
                });
                this.isLoading = false;
                this.listLoaded = true;
            });
    }

    add() {
        if (this.activity.trim() === "") {
            alert("Enter a grocery item");
            return;
        }

        // Dismiss the keyboard
        let textField = <TextField>this.activityTextField.nativeElement;
        textField.dismissSoftInput();

        this.activityService.add(this.activity)
            .subscribe(
                (groceryObject: Activity) => {
                    this.activityList.unshift(groceryObject);
                    this.activity = "";
                },
                () => {
                    alert({
                        message: "An error occurred while adding an item to your list.",
                        okButtonText: "OK"
                    });
                    this.activity = "";
                }
            )
    }

    onSwipeCellStarted(args: ListViewEventData) {
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args.object;
        var rightItem = swipeView.getViewById<View>("delete-view");
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.left = 0;
        swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
    }

    delete(args: ListViewEventData) {
        let activity = <Activity>args.object.bindingContext;
        this.activityService.delete(activity.id)
            .subscribe(() => {
                let index = this.activityList.indexOf(activity);
                this.activityList.splice(index, 1);
            });
    }
}