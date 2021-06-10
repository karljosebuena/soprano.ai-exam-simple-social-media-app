import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/common/interfaces/message.interface';
import { Post } from 'src/app/common/interfaces/post.interface';
import { AuthService } from 'src/app/common/services/auth.service';
import { MessageService } from 'src/app/common/services/message.service';
import { PostService } from './post.service';

@Component({
  selector: 'app-post-component',
  templateUrl: './post-component.html',
  styleUrls: ['./post-component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  userInitial = '';
  postForm = new FormGroup({
    post: new FormControl('')
  });
  message?: Message;
  subscription?: Subscription;
  searchFilter = '';
  currentPost!: Post;
  editMode = false;

  posts: Array<Post> = new Array();

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private messageService: MessageService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // subscribe to home component messages
    this.subscription = this.messageService.onMessage().subscribe(message => {
      const {
        instruction,
        data: {
          search = '',
          post = null
        } = {}
      } = message;

      switch (instruction) {
        case 'search':
          this.searchFilter = search;
          this.getPosts(search);
          break;
        case 'update':
          const {
            _id,
            post: body,
          } = post;
          this.postForm.controls.post.setValue(body);
          this.currentPost = post;
          this.editMode = true;
          break;
        default:
          console.log(`No handler for ${instruction} instruction.`)
          break;
      }
    });

    this.getPosts();
    this.getUserInitial();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription?.unsubscribe()
  }

  getUserInitial() {
    const {
      email,
    } = this.authService.decodedToken || {};

    const [name] = email.split('@');
    if (name.length === 1) {
      return this.userInitial = name
    }
    this.userInitial = name.substr(0, 2);
  }

  createForm(): void {
    this.postForm = this.formBuilder.group({
      post: [null, Validators.required],
    });
  }

  savePost() {
    const {
      post
    } = this.postForm.value;

    // update post
    if (this.editMode && post) {
      const { _id = '' } = this.currentPost || {};

      Object.assign(this.currentPost, this.postForm.value);
      this.postService.updatePost(_id, this.currentPost)
        .subscribe(
          data => {
            this.postForm.reset();
            this.getPosts(this.searchFilter);
          },
          err => {
            this._snackBar.open(err, 'Failed', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          }
        )
      return;
    }

    // create new post
    if (post) {
      this.postService.createPost({ post })
        .subscribe(
          data => {
            this.postForm.reset();
            this.getPosts(this.searchFilter);
          },
          err => {
            this._snackBar.open(err, 'Failed', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          }
        )
    }

  }

  getPosts(search: string = '') {
    this.postService.getAllPosts(search)
      .subscribe(
        (data: Post[]) => {
          const { name } = this.authService.decodedToken || {};
          this.posts = data.map(post => {
            if (post.created?.user === name) {
              post.editable = true;
            }
            return post;
          });
        },
        err => {
          this._snackBar.open(err, 'Failed', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      )
  }

  deletePost(id: string) {
    this.postService.deletePost(id)
      .subscribe(
        data => {
          this.getPosts(this.searchFilter);
        },
        err => {
          this._snackBar.open(err, 'Failed', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      )
  }

  editPost(post: Post) {
    this.messageService.sendMessage({
      instruction: 'update',
      data: {
        post
      }
    })
  }
}
